from flask import Flask
from flask import request

app = Flask(__name__)

@app.route("/callback",methods=['POST'])
def callback():
    code=request.form['code']
    userUuid=request.form['state']
    return print(code,userUuid)