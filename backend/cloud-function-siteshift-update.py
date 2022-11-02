import firebase_admin
from firebase_admin import firestore

firebase_admin.initialize_app()
db = firestore.client()


def ShiftUpdate(event):
    field = event["updateMask"]["fieldPaths"][0]
    if field == "attendance":
        siteUuid = event["value"]["fields"]["siteUuid"]["stringValue"]
        shiftHoursUuid = event["value"]["fields"]["shiftHoursUuid"]["stringValue"]
        weekday = int(event["value"]["fields"]["weekday"]["integerValue"])
        new_attendance = int(event["value"]["fields"]["attendance"]["integerValue"])
        ref = db.collection("MonthlyData").document("2022-11").collection("Shifts")
        beUpdatedShifts = (
            ref.where("shiftHoursUuid", "==", shiftHoursUuid)
            .where("siteUuid", "==", siteUuid)
            .where("weekday", "==", weekday)
            .get()
        )
        for shift in beUpdatedShifts:
            if len(shift.to_dict()["crewUuids"]) < new_attendance:
                shift.reference.update({"full": False, "attendance": new_attendance})
            else:
                shift.reference.update({"full": True, "attendance": new_attendance})
