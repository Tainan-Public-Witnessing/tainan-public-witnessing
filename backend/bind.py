from flask import redirect, request
from firebase_admin import auth


def BindUser(db):
    code = request.form.get("code")
    username = request.form.get("username")
    user = db.collection("Users").where("verify_code", "==", code).get()
    if user and user.to_dict()["username"] == username:
        subject = request.form.get("subject")
        user.reference.update({"subject": subject})
        custom_token = auth.create_custom_token(subject)
        return redirect(
            f"https://tainan-public-witnessing-v2211.firebaseapp.com/login#{custom_token}",
            code=302,
        )
    else:
        return redirect(
            "https://tainan-public-witnessing-v2211.firebaseapp.com/bind_error",
            code=302,
        )
