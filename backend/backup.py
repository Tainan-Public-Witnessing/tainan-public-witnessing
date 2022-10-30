from googleapiclient.discovery import build


def Backup(db):
    collections = [collection.id for collection in db.collections()]
    outputUriPrefix = "gs://tpw_backup/"
    body = {
        "collectionIds": collections,
        "outputUriPrefix": outputUriPrefix,
    }
    # Build REST API request for
    # https://cloud.google.com/firestore/docs/reference/rest/v1/projects.databases/exportDocuments
    project_id = "tainan-public-witnessing-v2211"
    database_name = f"projects/{project_id}/databases/(default)"
    service = build("firestore", "v1")
    service.projects().databases().exportDocuments(
        name=database_name, body=body
    ).execute()
    return "Operation started"
