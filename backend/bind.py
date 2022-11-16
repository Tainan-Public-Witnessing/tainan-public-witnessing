from flask import request, jsonify
from firebase_admin import auth, firestore
import requests
import uuid


def BindUser(db):
    code = request.json["bind_code"]
    query = db.collection("Users").where("bind_code", "==", code).get()

    line_token = request.json["line_token"]
    url_getUserInfo = "https://api.line.me/oauth2/v2.1/userinfo"
    headers = {"Authorization": f"Bearer {line_token}"}
    res = requests.get(url_getUserInfo, headers=headers)
    subject = res.json()["sub"]
    lineSubExist = db.collection("Users").where("lineSub", "==", subject).get()

    if query and len(query) == 1 and not lineSubExist:
        user_id = query[0].id
        permission = query[0].to_dict()["permission"]
        mail = f"{user_id}@mail.tpw"
        try:
            user = auth.get_user_by_email(mail)
        except auth.UserNotFoundError as e:
            password = uuid.uuid5(
                uuid.UUID("7b921192-c856-5152-8444-bb08b1efac9b"),
                query[0].to_dict()["baptizeDate"].replace("-", ""),
            )
            auth.create_user(email=mail, password=password)
        user = auth.get_user_by_email(mail)
        db.collection("Users").document(user_id).update(
            {
                "lineSub": subject,
                "firebaseSub": user.uid,
                "bind_code": firestore.DELETE_FIELD,
            }
        )
        additional_claims = {"uuid": user_id, "permission": permission}
        custom_token = auth.create_custom_token(user.uid, additional_claims).decode(
            "utf-8"
        )
        return jsonify({"bind": "success", "token": custom_token})

    elif len(query) > 1:
        return jsonify({"bind": "bind code duplicate"})
    elif lineSubExist:
        return jsonify({"bind": "Line user existed"})
    else:
        return jsonify({"bind": "wrong code"})
