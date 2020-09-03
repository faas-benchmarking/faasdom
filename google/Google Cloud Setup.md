# Google Cloud

- Register and create an account [https://cloud.google.com/](https://cloud.google.com/)
- Create a project (or use the default one), copy your project ID to the file [config.json](../main/config.json) into the object `google`, `project`.
- Enable the following services and APIs on your project:
  - Enable [Cloud Functions](https://console.cloud.google.com/functions)
  - Enable the [Cloud Functions API](https://console.developers.google.com/apis/api/cloudfunctions.googleapis.com/overview) (right afterwards in the functions menu)
- Enable the [Cloud Build API](https://console.developers.google.com/apis/api/cloudbuild.googleapis.com/overview)
