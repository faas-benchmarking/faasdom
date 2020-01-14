# IBM Cloud

- Register and create an account [https://www.ibm.com/cloud/](https://www.ibm.com/cloud/)
- Upgrade your account (necessary to use functions with CLI)
- Create an organization and inside that organization create a space for each region you want to use/test (see [https://cloud.ibm.com/docs/cloud-foundry/orgs-spaces.html](https://cloud.ibm.com/docs/cloud-foundry/orgs-spaces.html)) and save them to the file [config.json](../main/config.json) into the object `ibm`, `organization` resp. `space`. Please give each space the same name. You should do that for all regions as soon as possible, since it can take some time to get activated. **Remark:** You can leave out the Sydney region for this, since it does not support cloud functions.