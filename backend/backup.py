from googleapiclient.discovery import build


def Backup():
    outputUriPrefix = "gs://tpw-backup"
    body = {
        "outputUriPrefix": outputUriPrefix,
    }
    project_id = "tainan-public-witnessing-v2211"
    database_name = f"projects/{project_id}/databases/(default)"
    service = build("firestore", "v1")
    service.projects().databases().exportDocuments(
        name=database_name, body=body
    ).execute()
