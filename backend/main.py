from flask import Flask
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

import firebase_admin
from firebase_admin import firestore

import requests
import os

from shiftschedule import ShiftSchedule
from report import AttendanceReport
from callback import LineNotifyCallback
from vacancy import TomorrowVacancyNotify
from notify import (
    ScheduleReminder,
    ScheduleCompleteReminder,
    BeforeSevenDaysAssignmentNotify,
    TomorrowAssignmentNotify,
)

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
def LineNotifyCallback():
    LineNotifyCallback(db)


@app.route("/ScheduleReminder", methods=["GET"])
def ScheduleReminder():
    ScheduleReminder(LineNotify)


@app.route("/ScheduleCompleteReminder", methods=["GET"])
def ScheduleCompleteReminder():
    ScheduleCompleteReminder(LineNotify)


@app.route("/SevenDaysBeforeNotify", methods=["GET"])
def SevenDaysBeforeNotify():
    BeforeSevenDaysAssignmentNotify(db, LineNotify)


@app.route("/TomorrowNotify", methods=["GET"])
def TomorrowNotify():
    TomorrowAssignmentNotify(db, LineNotify)
    TomorrowVacancyNotify(db, LineNotify)


@app.route("/AttendanceReport", methods=["GET"])
def AttendanceReport():
    AttendanceReport(db, LineNotify)


@app.route("/ShiftSchedule", methods=["GET"])
def ShiftSchedule():
    ShiftSchedule(db)


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=int(os.environ.get("PORT", 8080)))
