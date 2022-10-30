from googleapiclient.discovery import build
import os


def Backup():
    outputUriPrefix = "gs://tpw-backup"
    body = {
        "outputUriPrefix": outputUriPrefix,
    }
    project_id = os.environ.get("GOOGLE_CLOUD_PROJECT")
    database_name = f"projects/{project_id}/databases/(default)"
    service = build("firestore", "v1")
    service.projects().databases().exportDocuments(
        name=database_name, body=body
    ).execute()
