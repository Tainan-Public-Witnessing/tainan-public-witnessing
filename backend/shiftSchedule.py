import json
import os
import uuid
from datetime import datetime

import pandas as pd
from dateutil.relativedelta import relativedelta
from dateutil.rrule import *
from firebase_admin import firestore


def ScheduleReminder(LineNotify):
    LINE_NOTIFY_CLIENT = json.loads(os.getenv("LINE_NOTIFY_CLIENT"))
    GROUP_TOKEN = LINE_NOTIFY_CLIENT["GROUP_TOKEN"]
    nextMonth = (datetime.today() + relativedelta(months=1, day=1)).strftime("%Y-%m")
    message = f"\n\n【每月排班提醒】\n\n如果你需要調整{nextMonth}的班表，請在今天晚上12點以前完成，你的留意可以使都市見證更順暢也減少額外的工作，謝謝大家的合作"
    LineNotify(GROUP_TOKEN, message)


def ScheduleCompleteReminder(LineNotify):
    LINE_NOTIFY_CLIENT = json.loads(os.getenv("LINE_NOTIFY_CLIENT"))
    GROUP_TOKEN = LINE_NOTIFY_CLIENT["GROUP_TOKEN"]
    nextMonth = (datetime.today() + relativedelta(months=1, day=1)).strftime("%Y年%m月")
    message = f"\n【{nextMonth} 班表通知】\n\n我們想通知大家{nextMonth}的班表已經排班完成了。\n\n★我們每個人都有可能收到委派，請務必確認自己的委派。\n如果你沒有收到委派，也歡迎你查詢空缺報名\n\n如有問題，請聯繫《管理者》"
    LineNotify(GROUP_TOKEN, message)


def ShiftSchedule(db):
    expired = datetime.today() + relativedelta(years=2, month=1, day=1)
    startDate = datetime.today() + relativedelta(months=1, day=1)
    endDate = datetime.today() + relativedelta(months=2, day=1, days=-1)
    ScheduleMonth = startDate.strftime("%Y-%m")
    LastMonth = (startDate + relativedelta(days=-1)).strftime("%Y-%m")
    ref = db.collection("MonthlyData").document(ScheduleMonth)
    available = []
    weekdayTodate = {"0": [], "1": [], "2": [], "3": [], "4": [], "5": [], "6": []}
    # 將該月份的每個日期按照工作日分類
    beArrangeddays = list(rrule(DAILY, dtstart=startDate, until=endDate))
    for day in beArrangeddays:
        w = day.isoweekday() if day.isoweekday() != 7 else 0
        weekdayTodate[str(w)].append(day.strftime("%Y-%m-%d"))

    # 抓取每個人的班表
    for doc in db.collection_group("Schedule").where("assign", "==", True).stream():
        name = doc.reference.parent.parent.id
        user = doc.to_dict()
        if "partnerUuid" in user:
            partner = user["partnerUuid"]
        else:
            partner = ""
        for weekday in user["availableHours"]:
            if not user["availableHours"][weekday]:
                user["unavailableDates"].extend(weekdayTodate[weekday])
        unavailableDate = filter(lambda x: LastMonth not in x, user["unavailableDates"])
        user["unavailableDates"] = sorted(list(set(unavailableDate)))
        for weekday in user["availableHours"]:
            for shifthour in user["availableHours"][weekday]:
                available.append(
                    {
                        "name": name,
                        "partner": partner,
                        "weekday": int(weekday),
                        "shiftHoursUuid": shifthour,
                        "attendance": user["availableHours"][weekday][shifthour],
                        "unavailableDates": user["unavailableDates"],
                        "unavailableCount": len(user["unavailableDates"]),
                    }
                )
    df = pd.DataFrame(available)

    batch = db.batch()
    upper_limit = 5  # 每月每個人的上限
    full = []
    statistics = {}
    yesterdayShift = []
    personalShifts = {}

    def adjustWeight(row):
        weight = 5 - row["attendance"]
        if row["name"] not in statistics and row["unavailableCount"] >= 25:
            return weight * 800
        elif row["name"] not in statistics:
            return weight * 20
        else:
            return weight

    def choose_participants(signup, attendance):
        choosen = []
        if len(signup) <= attendance:
            df.loc[signup.index, "attendance"] -= 1
            choosen = signup["name"].to_list()
        else:
            while len(choosen) < attendance:
                remaining = signup[
                    signup["name"].apply(lambda x: x not in choosen)
                ].copy()
                remaining["weight"] = remaining.apply(adjustWeight, axis=1)
                choosed = remaining.sample(1, weights=remaining["weight"])
                partner = choosed["partner"].values[0]
                if not partner or partner not in signup["name"].values:
                    choosen.append(choosed["name"].values[0])
                    df.loc[choosed.index, "attendance"] -= 1
                elif len(choosen) == attendance - 1:
                    for participant in choosen:
                        if not signup[signup["name"] == participant]["partner"].values:
                            choosen.remove(participant)
                            choosen.extend([choosed["name"].values[0], partner])
                            df.loc[
                                signup[signup["name"] == participant].index,
                                "attendance",
                            ] += 1
                            df.loc[choosed.index, "attendance"] -= 1
                            df.loc[
                                signup[signup["name"] == partner].index, "attendance"
                            ] -= 1
                            break
                elif len(choosen) < attendance - 1:
                    choosen.extend([choosed["name"].values[0], partner])
                    df.loc[choosed.index, "attendance"] -= 1
                    df.loc[signup[signup["name"] == partner].index, "attendance"] -= 1
                else:
                    continue
        return choosen

    for date in beArrangeddays:
        todayShift = []
        date_str = date.strftime("%Y-%m-%d")
        weekday = date.isoweekday() if date.isoweekday() != 7 else 0
        shifts = (
            db.collection("SiteShifts")
            .where("weekday", "==", weekday)
            .where("activate", "==", True)
            .get()
        )
        for shift in shifts:
            attendance = shift.to_dict()["attendance"]
            siteUuid = shift.to_dict()["siteUuid"]
            shiftHoursUuid = shift.to_dict()["shiftHoursUuid"]
            signup = df[
                (df["weekday"] == weekday)
                & (df["shiftHoursUuid"] == shiftHoursUuid)
                & (df["unavailableDates"].apply(lambda x: date_str not in x))
                & (df["name"].apply(lambda x: x not in todayShift))
                & (df["name"].apply(lambda x: x not in yesterdayShift))
                & (df["name"].apply(lambda x: x not in full))
                & (df["attendance"].apply(lambda x: x > 0))
            ]
            result = choose_participants(signup, attendance)
            todayShift.extend(result)
            uuid_ = str(uuid.uuid4())
            for person in result:
                if person not in personalShifts:
                    personalShifts[person] = [uuid_]
                else:
                    personalShifts[person].append(uuid_)
                if person in statistics:
                    statistics[person] += 1
                else:
                    statistics[person] = 1
                if statistics[person] >= upper_limit:
                    full.append(person)
            shift_data = {
                "activate": True,
                "crewUuids": result,
                "date": date_str,
                "shiftHoursUuid": shiftHoursUuid,
                "siteUuid": siteUuid,
                "uuid": uuid_,
                "expiredAt": expired,
                "attendance": attendance,
                "weekday": weekday,
            }
            if len(result) < attendance:
                shift_data["full"] = False
            else:
                shift_data["full"] = True
            batch.set(ref.collection("Shifts").document(uuid_), shift_data)

        yesterdayShift = todayShift
    batch.commit()
    ref_person = ref.collection("PersonalShifts")
    for person in personalShifts:
        data = {
            "shiftUuids": personalShifts[person],
            "uuid": person,
            "expiredAt": expired,
        }
        batch.set(ref_person.document(person), data)
    batch.set(ref, {"expiredAt": expired})
    batch.commit()

    # 刪除前一個月的unavailableDates
    expiredDates = [
        d.strftime("%Y-%m-%d")
        for d in list(
            rrule(
                DAILY,
                dtstart=startDate + relativedelta(months=-2),
                until=endDate + relativedelta(months=-2),
            )
        )
    ]
    users = db.collection_group("Schedule").where("unavailableDates", "!=", []).get()
    batch = db.batch()
    for user in users:
        batch.update(
            user.reference, {"unavailableDates": firestore.ArrayRemove(expiredDates)}
        )
    batch.commit()
    return ScheduleMonth
