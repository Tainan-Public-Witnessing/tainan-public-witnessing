from flask import Flask
from flask import request,jsonify
import os
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
import requests
app = Flask(__name__)

@app.route("/callback",methods=['POST'])
def callback():
    cred = credentials.ApplicationDefault()
    firebase_admin.initialize_app(cred)
    db = firestore.client()
    code=request.form['code']
    userUuid=request.form['state']
    url='https://notify-bot.line.me/oauth/token'
    parameter={
        'grant_type':"authorization_code",
        'code':code,
        'redirect_uri':'https://tainan-public-witnessing.firebaseapp.com/home',
        'client_id': 'CumN52DojP7D7fMERzuV5o',
        'client_secret':'wdE44tZ3tSf7ywlWM8DOle6n8MHlic77OgZqQbNsuPy',
    }
    headers={
        'Content-Type':'application/x-www-form-urlencoded'
    }
    res=requests.post(url,headers=headers,params=parameter)
    access_token=res.json()['access_token']
    db.collection('Users').document(userUuid).update({'lineToken':access_token})
    return jsonify({'status':'success'})

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=int(os.environ.get("PORT", 8080)))