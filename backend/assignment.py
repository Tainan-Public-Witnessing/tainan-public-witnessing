from datetime import datetime, timedelta

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


def BeforeSevenDays_AssignmentNotify(db, LineNotify):
    shifthours = {
        doc.id: {
            "name": doc.to_dict()["name"],
            "startTime": doc.to_dict()["startTime"],
            "endTime": doc.to_dict()["endTime"],
        }
        for doc in db.collection("ShiftHours").stream()
    }
    sites = {doc.id: doc.to_dict()["name"] for doc in db.collection("Sites").stream()}
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


def Tomorrow_AssignmentNotify(db, LineNotify):
    shifthours = {
        doc.id: {
            "name": doc.to_dict()["name"],
            "startTime": doc.to_dict()["startTime"],
            "endTime": doc.to_dict()["endTime"],
        }
        for doc in db.collection("ShiftHours").stream()
    }
    sites = {doc.id: doc.to_dict()["name"] for doc in db.collection("Sites").stream()}
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
