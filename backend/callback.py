from flask import redirect, request
import os
import requests
from firebase_admin import auth
from urllib.parse import urlparse
import re


def LineNotifyCallback(db, allowed_domains):
    code = request.form["code"]
    userUuid = request.form["state"]
    url = "https://notify-bot.line.me/oauth/token"
    callbackurl = os.getenv("backend_url")
    payload = {
        "grant_type": "authorization_code",
        "code": code,
        "redirect_uri": f"{callbackurl}/line-notify-callback",
        "client_id": os.getenv("client_id_notify"),
        "client_secret": os.getenv("client_secret_notify"),
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
    if check_in_allow_domain(state, allowed_domains):
        url = "https://api.line.me/oauth2/v2.1/token"
        callbackurl = os.getenv("backend_url")
        payload = {
            "grant_type": "authorization_code",
            "code": code,
            "redirect_uri": f"{callbackurl}/line-login-callback",
            "client_id": os.getenv("client_id_login"),
            "client_secret": os.getenv("client_secret_login"),
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
