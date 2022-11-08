from flask import jsonify, redirect, request
import os
import requests
from firebase_admin import auth


def LineNotifyCallback(db):
    code = request.form["code"]
    userUuid = request.form["state"]
    url = "https://notify-bot.line.me/oauth/token"
    payload = {
        "grant_type": "authorization_code",
        "code": code,
        "redirect_uri": "https://backend-4twc3jkzwa-de.a.run.app/line-notify-callback",
        "client_id": os.getenv("client_id_notify"),
        "client_secret": os.getenv("client_secret_notify"),
    }
    headers = {"Content-Type": "application/x-www-form-urlencoded"}
    res = requests.post(url, headers=headers, data=payload)
    access_token = res.json()["access_token"]
    db.collection("Users").document(userUuid).collection("Schedule").document(
        "config"
    ).update({"lineToken": access_token})
    return redirect(
        "https://tainan-public-witnessing-official.firebaseapp.com/", code=302
    )


def LineLoginCallback(db):
    code = request.form.get("code")
    url = "https://api.line.me/oauth2/v2.1/token"
    payload = {
        "grant_type": "authorization_code",
        "code": code,
        "redirect_uri": "https://backend-4twc3jkzwa-de.a.run.app/line-login-callback",
        "client_id": os.getenv("client_id_login"),
        "client_secret": os.getenv("client_secret_login"),
    }
    headers = {"Content-Type": "application/x-www-form-urlencoded"}
    res = requests.post(url, data=payload)
    access_token = res.json()["access_token"]
    url_getUserInfo = "https://api.line.me/oauth2/v2.1/userinfo"
    headers = {"Authorization": f"Bearer {access_token}"}
    res = requests.get(url_getUserInfo, headers=headers)
    subject = res.json()["sub"]
    user = db.collection("Users").where("subject", "==", subject).get()
    if user:
        custom_token = auth.create_custom_token(subject)
        return redirect(
            f"https://tainan-public-witnessing-official.firebaseapp.com/login#{custom_token}",
            code=302,
        )
    else:
        return redirect(
            f"https://tainan-public-witnessing-official.firebaseapp.com/register#{subject}",
            code=302,
        )
