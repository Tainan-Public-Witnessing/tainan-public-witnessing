from flask import Flask
from flask import request,jsonify,redirect
import os
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
import requests
app = Flask(__name__)

cred = credentials.ApplicationDefault()
firebase_admin.initialize_app(cred)
db = firestore.client()


@app.route("/callback",methods=['POST'])
def callback():
    code=request.form['code']
    userUuid=request.form['state']
    url='https://notify-bot.line.me/oauth/token'
    payload={
        'grant_type':"authorization_code",
        'code':code,
        'redirect_uri':'https://line-notify-callback-nj3qdvrhgq-de.a.run.app/callback',
        'client_id': 'CumN52DojP7D7fMERzuV5o',
        'client_secret':os.getenv('client_secret'),
    }
    headers={
        'Content-Type':'application/x-www-form-urlencoded'
    }
    res=requests.post(url,headers=headers,data=payload)
    access_token=res.json()['access_token']
    db.collection('Users').document(userUuid).collection('Schedule').document('config').update({'lineToken':access_token})
    return redirect("https://tainan-public-witnessing-test.firebaseapp.com/", code=302)

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=int(os.environ.get("PORT", 8080)))