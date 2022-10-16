from datetime import datetime, timedelta
import requests
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
import os
from calendar import monthrange

cred = credentials.ApplicationDefault()
firebase_admin.initialize_app(cred)
db = firestore.client()

shifthours = {
    doc.id: {
        "name": doc.to_dict()["name"],
        "startTime": doc.to_dict()["startTime"],
        "endTime": doc.to_dict()["endTime"],
    }
    for doc in db.collection("ShiftHours").stream()
}
sites = {doc.id: doc.to_dict()["name"] for doc in db.collection("Sites").stream()}
weekdayToChi = {
    0: "日",
    1: "一",
    2: "二",
    3: "三",
    4: "四",
    5: "五",
    6: "六",
}
hour_order = {"早上": 0, "中午": 1, "下午": 2, "黃昏": 3}
gender_dict = {"FEMALE": "姐妹", "MALE": "弟兄"}


def LineNotify(token, message):
    url = "https://notify-api.line.me/api/notify"
    headers = {"Authorization": f"Bearer {token}"}
    data = {"message": message}
    return requests.post(url, headers=headers, data=data)


def vacancyNotify():
    tomorrow = datetime.today() + timedelta(days=1)
    tomorrow_str = tomorrow.strftime("%Y-%m-%d")
    if tomorrow.isoweekday() == 7:
        weekday = 0
    else:
        weekday = tomorrow.isoweekday()
    tomorrowSiteShifts = (
        db.collection("SiteShifts").where("weekday", "==", weekday).stream()
    )
    hours = {}
    for hour in tomorrowSiteShifts:
        info = hour.to_dict()
        if info["siteUuid"] in hours:
            hours[info["siteUuid"]][info["shiftHoursUuid"]] = info["attendence"]
        else:
            hours[info["siteUuid"]] = {info["shiftHoursUuid"]: info["attendence"]}

    tomorrow_shifts = (
        db.collection("MonthlyData")
        .document(tomorrow_str[:7])
        .collection("Shifts")
        .where("date", "==", tomorrow_str)
        .stream()
    )
    vacancy = []
    for shift in tomorrow_shifts:
        siteUuid = shift.to_dict()["siteUuid"]
        shiftHourUuid = shift.to_dict()["shiftHoursUuid"]
        crew = len(shift.to_dict()["crewUuids"])
        attendence = hours[siteUuid][shiftHourUuid]
        if attendence > crew:
            vacancy.append(
                {
                    "site": sites[siteUuid],
                    "hour": shifthours[shiftHourUuid]["name"],
                    "vacancy": attendence - crew,
                }
            )

    if vacancy:
        grouptoken = os.getenv("token")
        vacancy = sorted(vacancy, key=lambda v: hour_order[v["hour"]])
        vacancy_str = [f"{v['site']} {v['hour']}：{v['vacancy']}名" for v in vacancy]
        content = "\n  ".join(vacancy_str)
        message = f"\n【緊急徵求支援人員】\n\n{tomorrow_str}({weekdayToChi[weekday]})\n  {content}\n\n請耐心等待。申請的時候請你再次確保那一天自己可以服務，這樣會大大減少弟兄們的負擔。謝謝你的合作！\n\n有意者，請聯繫管理者（http://nav.cx/54fnY0o） 謝謝！"
        LineNotify(grouptoken, message)


def ScheduleReminder():
    token = os.getenv("token")
    month = (datetime.now() + timedelta(days=32)).month
    message = f"\n【排班提醒】\n\n今天是15號，如果你{month}月份有一些安排需要調整班表，請在今天晚上12點以前完成，謝謝你們的合作"
    LineNotify(token, message)


def ScheduleCompleteNotify():
    token = os.getenv("token")
    month = (datetime.now() + timedelta(days=32)).month
    year = (datetime.now() + timedelta(days=32)).year
    message = f"\n【部門公告】 {year}年{month}月 班表開放查詢\n\n各位弟兄、姊妹你們好\n{year}年{month}月的班表已開放查詢。\n\n如有問題，請聯繫管理者( http://nav.cx/54fnY0o )。\n\n★我們每個人都有可能收到委派，請務必到網站上確認自己的班表"
    LineNotify(token, message)


def SevenDaysBeforeNotify():
    sevendays = datetime.today() + timedelta(days=7)
    sevendays_str = sevendays.strftime("%Y-%m-%d")
    if sevendays.isoweekday() == 7:
        weekday = 0
    else:
        weekday = sevendays.isoweekday()
    sevendays_shifts = (
        db.collection("MonthlyData")
        .document(sevendays_str[:7])
        .collection("Shifts")
        .where("date", "==", sevendays_str)
        .stream()
    )
    for shift in sevendays_shifts:
        siteUuid = shift.to_dict()["siteUuid"]
        shiftHourUuid = shift.to_dict()["shiftHoursUuid"]
        content = "\n".join(
            [
                f"日期：{sevendays_str}({weekdayToChi[weekday]})",
                f"地點：{sites[siteUuid]}",
                f"時段：{shifthours[shiftHourUuid]['name']}（{shifthours[shiftHourUuid]['startTime']} ~ {shifthours[shiftHourUuid]['endTime']}）",
            ]
        )
        for userUuid in shift.to_dict()["crewUuids"]:
            user = db.collection("Users").document(userUuid).get()
            name = user.to_dict()["name"]
            gender = user.to_dict()["gender"]
            token = (
                db.collection("Users")
                .document(userUuid)
                .collection("Schedule")
                .document("config")
                .get()
                .to_dict()["lineToken"]
            )
            message = f"\n\n【委派提醒】 您有7天後的委派\n\n{name}{gender_dict[gender]}您好，\n您7天後有都市見證委派\n\n{content}。\n\n如果對安排有任何疑問，請盡快聯繫《管理者》謝謝！\n\n★請勿在此回覆訊息"
            if token:
                LineNotify(token, message)


def TomorrowNotify():
    tomorrow = datetime.today() + timedelta(days=1)
    tomorrow_str = tomorrow.strftime("%Y-%m-%d")
    if tomorrow.isoweekday() == 7:
        weekday = 0
    else:
        weekday = tomorrow.isoweekday()
    tomorrow_shifts = (
        db.collection("MonthlyData")
        .document(tomorrow_str[:7])
        .collection("Shifts")
        .where("date", "==", tomorrow_str)
        .stream()
    )
    for shift in tomorrow_shifts:
        siteUuid = shift.to_dict()["siteUuid"]
        shiftHourUuid = shift.to_dict()["shiftHoursUuid"]
        content = "\n".join(
            [
                f"日期：{tomorrow_str}({weekdayToChi[weekday]})",
                f"地點：{sites[siteUuid]}",
                f"時段：{shifthours[shiftHourUuid]['name']}（{shifthours[shiftHourUuid]['startTime']} ~ {shifthours[shiftHourUuid]['endTime']}）",
            ]
        )
        for userUuid in shift.to_dict()["crewUuids"]:
            user = db.collection("Users").document(userUuid).get()
            name = user.to_dict()["name"]
            gender = user.to_dict()["gender"]
            token = (
                db.collection("Users")
                .document(userUuid)
                .collection("Schedule")
                .document("config")
                .get()
                .to_dict()["lineToken"]
            )
            message = f"\n\n【委派提醒】 您有明天的委派\n\n{name}{gender_dict[gender]}您好，\n您明天有都市見證委派\n\n{content}。\n\n如果對安排有任何疑問，請盡快聯繫《管理者》\n\n若您自行駕車前往，請盡量提早出門並且安全駕駛。如果你會遲到請直接打給當天的監督\n\n★★請勿在此回覆訊息★★"
            if token:
                LineNotify(token, message)


def Report():
    month = datetime.now().month
    year = datetime.now().year
    attended = [
        attend_user.id
        for attend_user in db.collection("MonthlyData")
        .document(f"{year}-{month:02}")
        .collection("PersonalShifts")
        .where("shiftUuids", "!=", [])
        .stream()
    ]
    NotAttendUsersId = [
        user.reference.parent.parent.id
        for user in db.collection_group("Schedule").where("assign", "==", True).stream()
        if user.reference.parent.parent.id not in attended
    ]
    NotAttendUsers = [
        db.collection("Users").document(userId).get().to_dict()["username"]
        for userId in NotAttendUsersId
    ]
    NotAttendUsers_str = "\n".join(NotAttendUsers)
    message = f"\n【{year}年{month}月未參與名單】\n{NotAttendUsers_str}"
    committee_uuids = [
        user.reference
        for user in db.collection("Users").where("permission", "==", 1).stream()
    ]
    for member in committee_uuids:
        doc = member.collection("Schedule").document("config").get().to_dict()
        if doc["lineToken"]:
            LineNotify(doc["lineToken"], message)


def Notify(event, context):
    vacancyNotify()
    if datetime.now().hour == 20 and datetime.now().day == 15:
        ScheduleReminder()
    if datetime.now().hour == 8 and datetime.now().day == 16:
        ScheduleCompleteNotify()
    if datetime.now().day == monthrange(datetime.now().year, datetime.now().month)[1]:
        Report()
    if datetime.now().hour == 8:
        SevenDaysBeforeNotify()
        TomorrowNotify()