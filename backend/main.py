from flask import Flask, jsonify, request
from flask_cors import cross_origin
from flask_limiter import Limiter
import redis

import firebase_admin
from firebase_admin import firestore

from dotenv import load_dotenv
from datetime import datetime
from calendar import monthrange
import requests
import os
import asyncio
import json

from shiftSchedule import ShiftSchedule, ScheduleReminder, ScheduleCompleteReminder
from report import AttendanceReport
from callback import LineNotifyCallback, LineLoginCallback
from vacancy import VacancyNotify
from assignment import AssignmentNotify
from bind import BindUser
from backup import Backup

load_dotenv()
app = Flask(__name__)

redis_password = os.environ.get("redis_password")
pool = redis.connection.BlockingConnectionPool.from_url(
    f"redis://:{redis_password}@redis-16040.c302.asia-northeast1-1.gce.cloud.redislabs.com:16040"
)
allowed_domains = json.loads(os.getenv("allowed_domains"))
allowed_domains.append(
    r"https://tainan-public-witnessing-official-test--preview-\w{8}.web.app"
)


def get_user_ip():
    return request.headers.get("X-Forwarded-For")


limiter = Limiter(
    app,
    key_func=get_user_ip,
    default_limits=["1000 per day", "100 per hour"],
    storage_uri="redis://",
    storage_options={"connection_pool": pool},
)

firebase_admin.initialize_app()
db = firestore.client()


def LineNotify(token, message):
    url = "https://notify-api.line.me/api/notify"
    headers = {"Authorization": f"Bearer {token}"}
    data = {"message": message}
    return requests.post(url, headers=headers, data=data)


@app.route("/line-notify-callback", methods=["POST"])
@limiter.limit("10/minute")
@limiter.limit("10/second")
def line_notify_callback():
    return LineNotifyCallback(db, allowed_domains)


@app.route("/line-login-callback", methods=["GET"])
@limiter.limit("40/minute")
@limiter.limit("10/second")
def line_login_callback():
    return LineLoginCallback(db, allowed_domains)


@app.route("/bind-user", methods=["POST"])
@cross_origin(origins=allowed_domains)
def bind_user():
    return BindUser(db)


@app.route("/schedule-reminder", methods=["GET"])
def schedule_reminder():
    ScheduleReminder(LineNotify)
    return jsonify({"status": f"已送出排班調整提醒"})


@app.route("/schedule-complete-reminder", methods=["GET"])
def schedule_complete_reminder():
    ScheduleCompleteReminder(LineNotify)
    return jsonify({"status": f"已送出排班完成提醒"})


@app.route("/assignment-notify", methods=["GET"])
async def assignment_notify():
    async with asyncio.TaskGroup() as tg:
        tg.create_task(AssignmentNotify(db, LineNotify, 1))
        tg.create_task(AssignmentNotify(db, LineNotify, 7))
    return jsonify({"status": f"已送出委派提醒"})


@app.route("/vacancy-notify", methods=["GET"])
async def vacancy_notify():
    async with asyncio.TaskGroup() as tg:
        tg.create_task(VacancyNotify(db, LineNotify, 1))
        # tg.create_task(VacancyNotify(db, LineNotify, 7))
    return jsonify({"status": f"已送出缺席提醒"})


@app.route("/attendance-report", methods=["GET"])
def attendance_report():
    if datetime.now().day == monthrange(datetime.now().year, datetime.now().month)[1]:
        AttendanceReport(db, LineNotify)
        return jsonify({"status": f"已送出報告"})


@app.route("/shift-schedule", methods=["GET"])
def shift_schedule():
    year, month = ShiftSchedule(db)
    return jsonify({"status": f"{year}-{month:02}排班完成"})


@app.route("/backup", methods=["GET"])
def backup():
    Backup()
    return ("", 204)


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=int(os.environ.get("PORT", 8080)))
