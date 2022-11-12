from googleapiclient.discovery import build
import os
import requests


def Backup():
    outputUriPrefix = "gs://tpw-backup"
    body = {
        "outputUriPrefix": outputUriPrefix,
    }
    url = "http://metadata.google.internal/computeMetadata/v1/project/project-id"
    headers = {"Metadata-Flavor": "Google"}
    project_id = requests.get(url, headers=headers).text
    database_name = f"projects/{project_id}/databases/(default)"
    service = build("firestore", "v1")
    service.projects().databases().exportDocuments(
        name=database_name, body=body
    ).execute()
