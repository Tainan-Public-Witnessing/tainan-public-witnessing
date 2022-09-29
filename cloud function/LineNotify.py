from datetime import datetime,timedelta
from linebot import LineBotApi,WebhookHandler
from linebot.models import MessageEvent, TextMessage, TextSendMessage
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
from firebase_admin import auth
import os

def vacancyNotify(event, context):
    cred = credentials.ApplicationDefault()
    firebase_admin.initialize_app(cred)
    db = firestore.client()
    # token='/zVHPZcDadNMLnWKEzom7MqsjeKWK9cVygyhS4YBvODB1E29ojddgaulRkLI3+0Z+o8wY2fSmSzKuRddH5ju6TMMdTjePOxy6zWgzq11o2oRn+WdyDEzZdMWHLO7Iq1sb7Wf8MNSS6f5t/gFTPMAtwdB04t89/1O/w1cDnyilFU='
    token=os.getenv('token')
    line_bot_api = LineBotApi(token)
    tomorrow=datetime.today()+timedelta(days=1)
    tomorrow_str=tomorrow.strftime('%Y-%m-%d')
    if tomorrow.isoweekday()==7:
        weekday=0
    else:
        weekday=tomorrow.isoweekday()
    todaySiteShifts=db.collection('SiteShifts').where('weekday','==',weekday).stream()
    weekdayToChi={
        0:'一',
        1:'二',
        2:'三',
        3:'四',
        4:'五',
        5:'六',
        6:'日',
    }
    hours={}
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
            vacancy.append(f'{site} {hour}：{attendence-crew}名')

    if vacancy:
        content='\n  '.join(vacancy)
        template=f'【部門公告】  緊急徵求支援人員\n\n{tomorrow_str}({weekdayToChi[weekday]})\n  {content}\n\n請耐心等待。申請的時候請你再次確保那一天自己可以服務，這樣會大大減少弟兄們的負擔。謝謝你的合作！\n\n有意者，請聯繫管理者（http://nav.cx/54fnY0o） 謝謝！'
        line_bot_api.push_message('Ce6ad7091c05e09e66d466338211b7ddd',TextSendMessage(text=template))
    
    if datetime.now().day==15 and datetime.now().hour==8:
        month=(datetime.now()+timedelta(days=32)).month
        remimder=f'【排班提醒】\n\n今天是15號，如果你{month}月份有一些安排需要調整班表，請在今天晚上12點以前完成，逾時不候'
        line_bot_api.push_message('Ce6ad7091c05e09e66d466338211b7ddd',TextSendMessage(text=remimder))

    if datetime.now().day==16 and datetime.now().hour==8:
        month=(datetime.now()+timedelta(days=32)).month
        year=(datetime.now()+timedelta(days=32)).year
        remimder=f'【部門公告】 {year}年{month}月 班表開放查詢\n\n各位弟兄、姊妹辛苦了!\n{year}年{month}月的班表已開放可供查詢，請各位儘速查詢自己個人班表，有無錯誤。\n\n如有問題，請透過管理者( http://nav.cx/54fnY0o )群組和部門的弟兄聯絡，負責的弟兄會儘快為你(妳)處理。'
        line_bot_api.push_message('Ce6ad7091c05e09e66d466338211b7ddd',TextSendMessage(text=remimder))