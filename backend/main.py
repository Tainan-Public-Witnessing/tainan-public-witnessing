from flask import Flask
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

import firebase_admin
from firebase_admin import firestore

from datetime import datetime
from calendar import monthrange
import requests
import os

from shiftSchedule import ShiftSchedule, ScheduleReminder, ScheduleCompleteReminder
from report import AttendanceReport
from callback import LineNotifyCallback, LineLoginCallback
from vacancy import Tomorrow_VacancyNotify
from assignment import BeforeSevenDays_AssignmentNotify, Tomorrow_AssignmentNotify
from bind import BindUser
from backup import Backup

app = Flask(__name__)
limiter = Limiter(
    app, key_func=get_remote_address, default_limits=["200 per day", "50 per hour"]
)

firebase_admin.initialize_app()
db = firestore.client()


def LineNotify(token, message):
    url = "https://notify-api.line.me/api/notify"
    headers = {"Authorization": f"Bearer {token}"}
    data = {"message": message}
    return requests.post(url, headers=headers, data=data)


@app.route("/LineNotifyCallback", methods=["POST"])
@limiter.limit("10/minute")
@limiter.limit("10/second")
def LineNotifyCallback():
    LineNotifyCallback(db)


@app.route("/LineLoginCallback", methods=["POST"])
def LineLoginCallback():
    LineLoginCallback(db)


@app.route("/BindUser", methods=["POST"])
def BindUser():
    BindUser(db)


@app.route("/ScheduleReminder", methods=["GET"])
def ScheduleReminder():
    ScheduleReminder(LineNotify)


@app.route("/ScheduleCompleteReminder", methods=["GET"])
def ScheduleCompleteReminder():
    ScheduleCompleteReminder(LineNotify)


@app.route("/AssignmentNotify", methods=["GET"])
def AssignmentNotify():
    BeforeSevenDays_AssignmentNotify(db, LineNotify)
    Tomorrow_AssignmentNotify(db, LineNotify)


@app.route("/VacancyNotify", methods=["GET"])
def VacancyNotify():
    Tomorrow_VacancyNotify(db, LineNotify)


@app.route("/AttendanceReport", methods=["GET"])
def AttendanceReport():
    if datetime.now().day == monthrange(datetime.now().year, datetime.now().month)[1]:
        AttendanceReport(db, LineNotify)


@app.route("/ShiftSchedule", methods=["GET"])
def ShiftSchedule():
    ShiftSchedule(db)


@app.route("/Backup", methods=["GET"])
def Backup():
    Backup(db)


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=int(os.environ.get("PORT", 8080)))
