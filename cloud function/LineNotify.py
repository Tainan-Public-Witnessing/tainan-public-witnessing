from datetime import datetime,timedelta
import requests
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
import os

def LineNotify(text):
    token=os.getenv('token')
    url='https://notify-api.line.me/api/notify'
    headers={
        'Authorization':f'Bearer {token}'
    }
    data={
        'message':text
    }
    return requests.post(url,headers=headers,data=data)

def vacancyNotify(event, context):
    cred = credentials.ApplicationDefault()
    firebase_admin.initialize_app(cred)
    db = firestore.client()
    
    tomorrow=datetime.today()+timedelta(days=1)
    tomorrow_str=tomorrow.strftime('%Y-%m-%d')
    if tomorrow.isoweekday()==7:
        weekday=0
    else:
        weekday=tomorrow.isoweekday()
    todaySiteShifts=db.collection('SiteShifts').where('weekday','==',weekday).stream()
    weekdayToChi={
        0:'日',
        1:'一',
        2:'二',
        3:'三',
        4:'四',
        5:'五',
        6:'六',
    }
    hours={}
    hour_order={'早上':0,'中午':1,'下午':2,'黃昏':3}
    for hour in todaySiteShifts:
        info=hour.to_dict()
        if info['siteUuid'] in hours:
            hours[info['siteUuid']][info['shiftHoursUuid']]=info['attendence']
        else:
            hours[info['siteUuid']]={info['shiftHoursUuid']:info['attendence']}

    today_shifts=db.collection('MonthlyData').document(tomorrow_str[:7]).collection('Shifts').where('date','==',tomorrow_str).stream()
    vacancy=[]
    for shift in today_shifts:
        siteUuid=shift.to_dict()['siteUuid']
        shiftHourUuid=shift.to_dict()['shiftHoursUuid']
        crew=len(shift.to_dict()['crewUuids'])
        attendence=hours[siteUuid][shiftHourUuid]
        if attendence>crew:
            hour=db.collection('ShiftHours').document(shiftHourUuid).get().to_dict()['name']
            site=db.collection('Sites').document(siteUuid).get().to_dict()['name']
            vacancy.append({'site':site,'hour':hour,'vacancy':attendence-crew})

    if vacancy:
        vacancy=sorted(vacancy, key=lambda v: hour_order[v['hour']]) 
        vacancy_str=[f"{v['site']} {v['hour']}：{v['vacancy']}名" for v in vacancy]
        content='\n  '.join(vacancy_str)
        reminder=f'\n【緊急徵求支援人員】\n\n{tomorrow_str}({weekdayToChi[weekday]})\n  {content}\n\n請耐心等待。申請的時候請你再次確保那一天自己可以服務，這樣會大大減少弟兄們的負擔。謝謝你的合作！\n\n有意者，請聯繫管理者（http://nav.cx/54fnY0o） 謝謝！'
        LineNotify(text=reminder)
    
    if datetime.now().day==15 and datetime.now().hour==8:
        month=(datetime.now()+timedelta(days=32)).month
        remimder=f'\n【排班提醒】\n\n今天是15號，如果你{month}月份有一些安排需要調整班表，請在今天晚上12點以前完成，逾時不候'
        LineNotify(text=remimder)

    if datetime.now().day==16 and datetime.now().hour==8:
        month=(datetime.now()+timedelta(days=32)).month
        year=(datetime.now()+timedelta(days=32)).year
        remimder=f'\n【部門公告】 {year}年{month}月 班表開放查詢\n\n各位弟兄、姊妹辛苦了!\n{year}年{month}月的班表已開放可供查詢，請各位儘速查詢自己個人班表，有無錯誤。\n\n如有問題，請透過管理者( http://nav.cx/54fnY0o )群組和部門的弟兄聯絡，負責的弟兄會儘快為你(妳)處理。'
        LineNotify(text=remimder)
