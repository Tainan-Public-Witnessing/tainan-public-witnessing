from datetime import datetime
import requests
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
import os

def LineNotify(text,token):
    token=os.getenv('token')
    url='https://notify-api.line.me/api/notify'
    headers={
        'Authorization':f'Bearer {token}'
    }
    data={
        'message':text
    }
    return requests.post(url,headers=headers,data=data)

def Report(event,context):
    month=datetime.now().month
    year=datetime.now().year
    cred = credentials.ApplicationDefault()
    firebase_admin.initialize_app(cred)
    db = firestore.client()
    attended=[attend_user.id for attend_user in db.collection('MonthlyData').document(f'{year}-{month:02}').collection('PersonalShifts').where('shiftUuids','!=',[]).stream()]
    NotAttendUsersId=[user.reference.parent.parent.id for user in db.collection_group('Schedule').where('assign','==',True).stream() if user.reference.parent.parent.id not in attended]
    NotAttendUsers=[db.collection('Users').document(userId).get().to_dict()['username'] for userId in NotAttendUsersId]
    NotAttendUsers_str='\n'.join(NotAttendUsers)
    message=f"【{month}月未參與名單】\n{NotAttendUsers_str}"
    committee_tokens=[ user.to_dict()['token'] for user in db.collection('Users').where('permission','==',1).stream()]
    for token in committee_tokens:
        LineNotify(message,token)
