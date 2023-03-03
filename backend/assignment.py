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


async def AssignmentNotify(db, LineNotify, n):
    nth_days = datetime.today() + timedelta(days=n)
    nth_days_str = nth_days.strftime("%Y-%m-%d")
    weekday = nth_days.isoweekday() if nth_days.isoweekday() != 7 else 0
    nth_days_shifts = (
        db.collection("MonthlyData")
        .document(nth_days_str[:7])
        .collection("Shifts")
        .where('activate','==',True)
        .where("date", "==", nth_days_str)
        .stream()
    )
    for shift in nth_days_shifts:
        siteUuid = shift.to_dict()["siteUuid"]
        shiftHourUuid = shift.to_dict()["shiftHoursUuid"]
        site_doc = db.collection("Sites").document(siteUuid).get().to_dict()
        shifthour_doc = (
            db.collection("ShiftHours").document(shiftHourUuid).get().to_dict()
        )
        site_name = site_doc["name"]
        shifthour_name = shifthour_doc["name"]
        shifthour_startTime = shifthour_doc["startTime"]
        shifthour_endTime = shifthour_doc["endTime"]
        content = "\n".join(
            [
                f"日期：{nth_days_str}({weekdayToChi[weekday]})",
                f"地點：{site_name}",
                f"時段：{shifthour_name}（{shifthour_startTime} ~ {shifthour_endTime}）",
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
            if n == 1:
                message = f"\n\n【委派提醒 明天的委派】\n\n{name}{gender_dict[gender]}您好，\n您明天有都市見證委派\n\n{content}。\n\n如果對委派有任何疑問，請盡快聯繫《管理者》\n\n若您自行駕車前往，請盡量提早出門並且安全駕駛。如果你會遲到請直接打給緊急處理的弟兄（任何一位），謝謝你的合作\n\n★★請勿在此回覆訊息★★"
            else:
                message = f"\n\n【委派提醒 {n}天後的委派】\n\n{name}{gender_dict[gender]}您好，\n您{n}天後有都市見證委派\n\n{content}。\n\n如果對委派有任何疑問，請盡快聯繫《管理者》謝謝！\n\n★請勿在此回覆訊息"
            if token:
                LineNotify(token, message)
