from datetime import datetime, timedelta
import os

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


def Tomorrow_VacancyNotify(db, LineNotify):
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
        grouptoken = os.getenv("grouptoken")
        vacancy = sorted(vacancy, key=lambda v: hour_order[v["hour"]])
        vacancy_str = [f"{v['site']} {v['hour']}：{v['vacancy']}名" for v in vacancy]
        content = "\n  ".join(vacancy_str)
        message = f"\n【緊急徵求支援人員】\n\n{tomorrow_str}({weekdayToChi[weekday]})\n  {content}\n\n請耐心等待。申請的時候請你再次確保那一天自己可以服務，這樣會大大減少弟兄們的負擔。謝謝你的合作！\n\n有意者，請聯繫管理者（http://nav.cx/54fnY0o） 謝謝！"
        LineNotify(grouptoken, message)
