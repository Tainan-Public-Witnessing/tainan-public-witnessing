from datetime import datetime


def AttendanceReport(db, LineNotify):
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
