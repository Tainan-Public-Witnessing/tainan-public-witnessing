from flask import Flask
from flask import request
import os
from flask import Flask

app = Flask(__name__)

@app.route("/callback",methods=['POST'])
def callback():
    code=request.form['code']
    userUuid=request.form['state']
    return print(code,userUuid)

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=int(os.environ.get("PORT", 8080)))