from flask import redirect, request,jsonify
from firebase_admin import auth


def BindUser(db):
    code = request.form.get("code")
    query = db.collection("Users").where("bindcode", "==", code).get()
    if query:
        mail=f"{query[0].id}@mail.tpw"
        user=auth.get_user_by_email(mail)
        custom_token = auth.create_custom_token(user.uid)
        return jsonify({'bind':'success','token':custom_token})
    else:
        return jsonify({'bind':'wrong code'})
