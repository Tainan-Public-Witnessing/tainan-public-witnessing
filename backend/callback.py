from flask import redirect, request
import os
import requests
from firebase_admin import auth
from urllib.parse import urlparse
import re
import json


def LineNotifyCallback(db, allowed_domains):
    code = request.form["code"]
    userUuid = request.form["state"]
    LINE_NOTIFY_CLIENT = json.loads(os.getenv("LINE_NOTIFY_CLIENT"))
    url = "https://notify-bot.line.me/oauth/token"
    payload = {
        "grant_type": "authorization_code",
        "code": code,
        "redirect_uri": f'{os.getenv("BACKEND_URL")}/line-notify-callback',
        "client_id": LINE_NOTIFY_CLIENT["ID"],
        "client_secret": LINE_NOTIFY_CLIENT["SECRET"],
    }
    headers = {"Content-Type": "application/x-www-form-urlencoded"}
    res = requests.post(url, headers=headers, data=payload)
    access_token = res.json()["access_token"]
    db.collection("Users").document(userUuid).collection("Schedule").document(
        "config"
    ).update({"lineToken": access_token})
    return redirect(allowed_domains[0], code=302)


def LineLoginCallback(db, allowed_domains):
    code = request.args.get("code")
    state = request.args.get("state")
    LINE_LOGIN_CLIENT = json.loads(os.getenv("LINE_LOGIN_CLIENT"))
    if check_in_allow_domain(state, allowed_domains):
        url = "https://api.line.me/oauth2/v2.1/token"
        payload = {
            "grant_type": "authorization_code",
            "code": code,
            "redirect_uri": f'{os.getenv("BACKEND_URL")}/line-login-callback',
            "client_id": LINE_LOGIN_CLIENT["ID"],
            "client_secret": LINE_LOGIN_CLIENT["SECRET"],
        }
        res = requests.post(url, data=payload)
        access_token = res.json()["access_token"]

        url_getUserInfo = "https://api.line.me/oauth2/v2.1/userinfo"
        headers = {"Authorization": f"Bearer {access_token}"}
        res = requests.get(url_getUserInfo, headers=headers)
        subject = res.json()["sub"]

        query = db.collection("Users").where("lineSub", "==", subject).get()
        if query:
            fireSub = query[0].to_dict()["firebaseSub"]
            custom_token = auth.create_custom_token(fireSub).decode("utf-8")
            return redirect(
                f"{urlparse(state).scheme}://{urlparse(state).netloc}/login?return={urlparse(state).path}#{custom_token}",
                code=302,
            )
        else:
            return redirect(
                f"{urlparse(state).scheme}://{urlparse(state).netloc}/bind#{access_token}",
                code=302,
            )
    else:
        return redirect(
            f"{allowed_domains[0]}",
            code=302,
        )


def check_in_allow_domain(url, allowed_domains):
    if not url:
        return False
    else:
        for domain in allowed_domains:
            if bool(
                re.match(domain, f"{urlparse(url).scheme}://{urlparse(url).netloc}")
            ):
                return True
        return False
