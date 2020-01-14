# Amazon Web Services

  - Register and create an account [https://aws.amazon.com/](https://aws.amazon.com/)
  - Under *Security, Identity & Compliance* go to *IAM* then to *Roles*
  - Select *Create role*, then select *Lambda* and click on *Next: Permissions*.
  - Select the rights *AWSLambdaBasicExecutionRole* and *AmazonAPIGatewayAdministrator* and click on *Next: Tags*.
  - Skip this step, click on *Next: Review*.
  - Enter a name for the role, e.g. **lambda-cli-role** and click *Create Role*.
  - Click on the created role. There you can see the ARN. Copy it and save it to the file [config.json](../main/config.json) into the object `aws`, `arn_role`.
  - Under *IAM*, *Users* select you user and then *Security Credentials*
  - Click on *Create access key* and note down the *Access key ID* and the *Secret access key*, you need them later for login with the CLI

#### Remark

If you want to use the regions *me-south-1, Middle East (Bahrain)* and *ap-east-1, Asia Pacific (Hong Kong)* you will have to manually activate them in the AWS console in the browser. See [https://console.aws.amazon.com/billing/home?#/account?AWS-Regions](https://console.aws.amazon.com/billing/home?#/account?AWS-Regions)