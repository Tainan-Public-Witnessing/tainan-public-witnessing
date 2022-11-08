from flask import request, jsonify
from firebase_admin import auth
import requests


def BindUser(db):
    code = request.json["bind_code"]
    query = db.collection("Users").where("bind_code", "==", code).get()
    if query:
        user_id = query[0].id
        line_token = request.json["line_token"]
        url_getUserInfo = "https://api.line.me/oauth2/v2.1/userinfo"
        headers = {"Authorization": f"Bearer {line_token}"}
        res = requests.get(url_getUserInfo, headers=headers)
        subject = res.json()["sub"]
        mail = f"{user_id}@mail.tpw"
        user = auth.get_user_by_email(mail)
        db.collection("Users").document(user_id).update(
            {"lineSub": subject, "firebaseSub": user.uid}
        )
        custom_token = auth.create_custom_token(user.uid).decode("utf-8")
        return jsonify({"bind": "success", "token": custom_token})
    else:
        return jsonify({"bind": "wrong code"})
