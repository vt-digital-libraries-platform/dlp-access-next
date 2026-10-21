# Lambdas

AWS Lambda functions used by this app. Each folder is one function; its code here is the
source of truth for what's deployed. These aren't part of the Next.js build.

## submitFeedback

Handles Contact Us / Feedback form submissions (`/feedback`). Saves each submission to
DynamoDB and emails it with SES. Called through API Gateway: `POST {endpoint}/submit`.

| | Production | Preprod |
|---|---|---|
| Account | `<production-account-id>` | `<preprod-account-id>` |
| Lambda | `submitFeedback-production` | `submitFeedback-pprd` |
| Role | `submitFeedback-production-role` | `submitFeedback-pprd-role` |
| Table | `Feedback-production` | `Feedback-pprd` |
| API Gateway | `feedbackapi`, stage `production` | `feedbackapi-pprd`, stage `pprd` |

Settings (Lambda environment variables): `FEEDBACK_TABLE_NAME`, `FEEDBACK_EMAIL_TO`
(also the sender, so it must be verified in SES), `ENV`, `REGION`.

API Gateway throttling: `<rate>` requests/second, burst `<burst>` (see the stage settings in API Gateway).

### Deploy a code change

```bash
cd src/app/_lambda/submitFeedback
npm ci --omit=dev
zip -r ../submitFeedback.zip .
aws lambda update-function-code --function-name submitFeedback-pprd --zip-file fileb://../submitFeedback.zip
rm ../submitFeedback.zip
```
