from flask import redirect, request
import os
import requests


def LineNotifyCallback(db):
    code = request.form["code"]
    userUuid = request.form["state"]
    url = "https://notify-bot.line.me/oauth/token"
    payload = {
        "grant_type": "authorization_code",
        "code": code,
        "redirect_uri": "https://backend-4twc3jkzwa-de.a.run.app/LineNotifyCallback",
        "client_id": "CumN52DojP7D7fMERzuV5o",
        "client_secret": os.getenv("client_secret"),
    }
    headers = {"Content-Type": "application/x-www-form-urlencoded"}
    res = requests.post(url, headers=headers, data=payload)
    access_token = res.json()["access_token"]
    db.collection("Users").document(userUuid).collection("Schedule").document(
        "config"
    ).update({"lineToken": access_token})
    return redirect("https://tainan-public-witnessing-v2211.firebaseapp.com/", code=302)
