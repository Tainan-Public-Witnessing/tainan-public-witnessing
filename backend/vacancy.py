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


async def VacancyNotify(db, LineNotify, n):
    nth_days = datetime.today() + timedelta(days=n)
    nth_days_str = nth_days.strftime("%Y-%m-%d")
    if nth_days.isoweekday() == 7:
        weekday = 0
    else:
        weekday = nth_days.isoweekday()
    nth_days_vacancy_shifts = (
        db.collection("MonthlyData")
        .document(nth_days_str[:7])
        .collection("Shifts")
        .where("date", "==", nth_days_str)
        .where("full", "==", False)
        .stream()
    )
    vacancy = []
    for shift in nth_days_vacancy_shifts:
        siteUuid = shift.to_dict()["siteUuid"]
        shiftHourUuid = shift.to_dict()["shiftHoursUuid"]
        crew = len(shift.to_dict()["crewUuids"])
        attendance = (
            db.collection("SiteShifts")
            .where("siteUuid", "==", siteUuid)
            .where("shiftHourUuid", "==", shiftHourUuid)
            .where("weekday", "==", weekday)
            .get()
            .to_dict()["attendance"]
        )
        vacancy.append(
            {
                "site": db.collection("Sites")
                .document(siteUuid)
                .get()
                .to_dict()["name"],
                "hour": db.collection("ShiftHours")
                .document(shiftHourUuid)
                .get()
                .to_dict()["name"],
                "vacancy": attendance - crew,
            }
        )

    if vacancy:
        grouptoken = os.getenv("grouptoken")
        vacancy = sorted(vacancy, key=lambda v: hour_order[v["hour"]])
        vacancy_str = [f"{v['site']} {v['hour']}：{v['vacancy']}名" for v in vacancy]
        content = "\n  ".join(vacancy_str)
        message = f"\n【緊急徵求支援人員】\n\n{nth_days_str}({weekdayToChi[weekday]})\n  {content}\n\n歡迎有意願的人直接進入網站自行報名。\n\n★請留意：網站預設有報名上限，若你已經達到上限，請改向《管理者》人工報名"
        LineNotify(grouptoken, message)
