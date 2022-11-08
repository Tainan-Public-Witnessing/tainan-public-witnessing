import firebase_admin
from firebase_admin import firestore
from datetime import datetime

firebase_admin.initialize_app()
db = firestore.client()


def ShiftUpdate(event, context):
    field = event["updateMask"]["fieldPaths"][0]
    today = datetime.today().strftime("%Y-%m-%d")
    if field == "attendance":
        siteUuid = event["value"]["fields"]["siteUuid"]["stringValue"]
        shiftHoursUuid = event["value"]["fields"]["shiftHoursUuid"]["stringValue"]
        weekday = int(event["value"]["fields"]["weekday"]["integerValue"])
        new_attendance = int(event["value"]["fields"]["attendance"]["integerValue"])
        ref = db.collection_group("Shifts")
        beUpdatedShifts = (
            ref.where("shiftHoursUuid", "==", shiftHoursUuid)
            .where("siteUuid", "==", siteUuid)
            .where("weekday", "==", weekday)
            .where("date", ">=", today)
            .get()
        )
        for shift in beUpdatedShifts:
            if len(shift.to_dict()["crewUuids"]) < new_attendance:
                shift.reference.update({"full": False, "attendance": new_attendance})
            else:
                shift.reference.update({"full": True, "attendance": new_attendance})
