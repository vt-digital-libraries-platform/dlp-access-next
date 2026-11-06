/* Amplify Params - DO NOT EDIT
	API_VTDLP_FEEDBACKTABLE_ARN
	API_VTDLP_FEEDBACKTABLE_NAME
	API_VTDLP_GRAPHQLAPIIDOUTPUT
	ENV
	REGION
Amplify Params - DO NOT EDIT */

const AWS = require('aws-sdk');
const ses = new AWS.SES({ region: process.env.REGION || 'us-east-1' });
const dynamodb = new AWS.DynamoDB.DocumentClient();

// --- SECURITY HELPERS ---

// Whitelist of the only values feedbackType is allowed to be.
// Any value not in this list is rejected before touching DynamoDB or SES.
// This prevents arbitrary strings — including HTML tags — appearing in the
// email subject line or being stored in the database.
const ALLOWED_FEEDBACK_TYPES = [
  'Accessibility Barrier',
  'Issue',
  'General Feedback'
];

// Max lengths mirror the frontend maxLength attributes.
// We enforce them here too because the frontend can be bypassed by anyone
// calling the API Gateway URL directly (e.g. via curl or DevTools).
const MAX_MESSAGE_LENGTH  = 5000;
const MAX_EMAIL_LENGTH    = 254;   // RFC 5321 standard maximum for email addresses
const MAX_SITENAME_LENGTH = 200;

// sanitizeString: strips \r, \n, and other invisible control characters.
// \r and \n are the most dangerous — email headers are separated by \r\n,
// so an attacker who puts \r\nBcc: spam@evil.com into the submittedBy field
// can inject extra headers into the outgoing SES email.
// We also check typeof first because if a field is missing entirely, calling
// .replace on undefined would crash the Lambda.
const sanitizeString = (value) => {
  if (typeof value !== 'string') return '';
  return value.replace(/[\r\n\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
};

// escapeHtml: converts characters that have special meaning in HTML into
// their safe display equivalents before inserting user content into the
// HTML email template.
//
// Without this:  attacker types <img src=x onerror="steal(document.cookie)">
//                email HTML executes that as real HTML
//
// With this:     attacker types <img src=x onerror="steal(document.cookie)">
//                email HTML shows &lt;img src=x ...&gt;  (plain text, harmless)
//
// & must be replaced FIRST. If you replaced it last, the & characters
// introduced by &lt; and &gt; would themselves get escaped into &amp;lt;
// producing double-escaped output like &amp;lt;script&amp;gt;
const escapeHtml = (str) => {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

// validateEmailFormat: stricter than a basic presence check.
// Requires: [something] @ [domain] . [2+ character TLD]
// Rejects: "a@b" (no TLD), "notanemail", "@nodomain.com" etc.
const validateEmailFormat = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
};

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
  console.log('Received event:', JSON.stringify(event, null, 2));

  // Handle CORS preflight — browser sends OPTIONS before the real POST
  // to check if cross-origin requests are allowed from the React app's domain
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
        'Access-Control-Allow-Methods': 'OPTIONS,POST'
      },
      body: ''
    };
  }

  try {
    const body = JSON.parse(event.body);
    // NOTE: body.emailTo is deliberately NOT read. See cleanEmailTo below.
    const { feedbackType, message, siteName, submittedBy } = body;

    // --- SANITIZE ALL INPUTS ---
    // Strip control characters from every field before any validation or use.
    // This runs regardless of what the frontend sent — the frontend sanitization
    // is advisory (users can call this endpoint directly bypassing the browser).
    const cleanFeedbackType = sanitizeString(feedbackType);
    const cleanMessage      = sanitizeString(message);
    const cleanSiteName     = sanitizeString(siteName);
    // SECURITY: the destination address comes from this Lambda's own
    // configuration, never from the request body.
    //
    // This endpoint is public and unauthenticated — anyone can POST to it with
    // curl. If we trusted body.emailTo, and the vt.edu domain were ever verified
    // in SES, this function would become an open mail relay: send from a trusted
    // VT address to any recipient an attacker chooses.
    //
    // The frontend still sends emailTo (from siteOptions). We ignore it.
    // To change the destination, update the FEEDBACK_EMAIL_TO env var.
    const cleanEmailTo      = sanitizeString(process.env.FEEDBACK_EMAIL_TO || '');
    const cleanSubmittedBy  = sanitizeString(submittedBy);

    // --- VALIDATE ALL INPUTS ---
    // Validation runs on the sanitized values, not the raw input.
    // Each check returns a 400 immediately if it fails — nothing is written
    // to DynamoDB or sent via SES until all validations pass.

    // 1. Required fields — feedbackType, message, siteName, emailTo must exist
    if (!cleanFeedbackType || !cleanMessage || !cleanSiteName || !cleanEmailTo) {
      return {
        statusCode: 400,
        headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
        body: JSON.stringify({ success: false, message: 'Missing required fields' })
      };
    }

    // 2. feedbackType whitelist — must be one of the three known values.
    // Rejects any arbitrary string an attacker might send (HTML, scripts, etc.)
    if (!ALLOWED_FEEDBACK_TYPES.includes(cleanFeedbackType)) {
      return {
        statusCode: 400,
        headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
        body: JSON.stringify({ success: false, message: 'Invalid feedback type' })
      };
    }

    // 3. Accessibility Barrier requires an email address.
    // Issue and General Feedback do not — submittedBy is optional for those.
    if (cleanFeedbackType === 'Accessibility Barrier' && !cleanSubmittedBy.trim()) {
      return {
        statusCode: 400,
        headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
        body: JSON.stringify({ success: false, message: 'Email is required for Accessibility Barrier reports' })
      };
    }

    // 4. Message length — blocks oversized payloads that could inflate SES
    // email size or cause Lambda timeouts on very large strings
    if (cleanMessage.length > MAX_MESSAGE_LENGTH) {
      return {
        statusCode: 400,
        headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
        body: JSON.stringify({ success: false, message: 'Message exceeds maximum length' })
      };
    }

    // 5. siteName length — sanity check on the site name from siteOptions
    if (cleanSiteName.length > MAX_SITENAME_LENGTH) {
      return {
        statusCode: 400,
        headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
        body: JSON.stringify({ success: false, message: 'Site name exceeds maximum length' })
      };
    }

    // 6. emailTo format — validates the destination address before SES tries
    // to use it. A malformed address causes SES to throw, which we'd catch
    // below, but validating here gives a clearer error and avoids the SES call
    if (!validateEmailFormat(cleanEmailTo)) {
      return {
        statusCode: 400,
        headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
        body: JSON.stringify({ success: false, message: 'Invalid destination email address' })
      };
    }

    // 7. submittedBy format — only validated if the user actually provided one.
    // The cleanSubmittedBy && guard skips this for Issue and General Feedback
    // where the email field was left blank
    if (cleanSubmittedBy && !validateEmailFormat(cleanSubmittedBy)) {
      return {
        statusCode: 400,
        headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
        body: JSON.stringify({ success: false, message: 'Invalid submitter email address' })
      };
    }

    const timestamp  = new Date().toISOString();
    const feedbackId = `feedback-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // feedbackItem uses clean* variables — raw input is never written to DynamoDB
    const feedbackItem = {
      id: feedbackId,
      __typename: 'Feedback',
      feedbackType:  cleanFeedbackType,
      message:       cleanMessage,
      submittedAt:   timestamp,
      submittedBy:   cleanSubmittedBy || 'Anonymous',
      emailedTo:     cleanEmailTo,
      siteName:      cleanSiteName,
      status:        'new',
      emailSent:     false,
      createdAt:     timestamp,
      updatedAt:     timestamp
    };

    // 1. SAVE TO DYNAMODB
    // FEEDBACK_TABLE_NAME is used by the standalone (non-Amplify) deployment.
    // API_VTDLP_FEEDBACKTABLE_NAME is the name Amplify generates in the dev
    // environments — kept as a fallback so this file runs unchanged in both.
    const tableName = process.env.FEEDBACK_TABLE_NAME
      || process.env.API_VTDLP_FEEDBACKTABLE_NAME;
    console.log('Saving to DynamoDB table:', tableName);

    await dynamodb.put({
      TableName: tableName,
      Item: feedbackItem
    }).promise();

    console.log('Successfully saved to DynamoDB');

    // 2. SEND EMAIL VIA SES
    let emailSent  = false;
    let emailError = null;

    try {
      // escapeHtml() is applied to every user-provided value in the HTML template.
      // This converts < > & " ' into safe HTML entities so that any HTML or
      // script tags a user typed appear as harmless visible text in the email
      // rather than executing as real HTML.
      //
      // For cleanMessage specifically:
      //   escapeHtml() runs FIRST  — makes the content safe
      //   .replace(\n → <br>) runs SECOND — converts line breaks to HTML breaks
      //   This order is critical: if we added <br> first, escapeHtml would then
      //   escape those <br> tags into &lt;br&gt; and they'd show as literal text
      const safeType      = escapeHtml(cleanFeedbackType);
      const safeSite      = escapeHtml(cleanSiteName);
      const safeSubmitter = escapeHtml(cleanSubmittedBy || 'Anonymous');
      const safeMessage   = escapeHtml(cleanMessage).replace(/\n/g, '<br>');
      const safeId        = escapeHtml(feedbackId);

      const emailParams = {
        Source: cleanEmailTo,
        Destination: {
          ToAddresses: [cleanEmailTo]
        },
        Message: {
          Subject: {
            Data: `${cleanSiteName} ${cleanFeedbackType} Report`
          },
          Body: {
            Html: {
              Data: `
                <!DOCTYPE html>
                <html>
                <head>
                  <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background-color: #861F41; color: white; padding: 20px; border-radius: 5px 5px 0 0; }
                    .content { background-color: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
                    .footer { background-color: #f4f4f4; padding: 15px; text-align: center; font-size: 12px; color: #666; }
                    .label { font-weight: bold; color: #861F41; }
                    .message-box { background-color: white; padding: 15px; margin: 15px 0; border-left: 4px solid #861F41; }
                    .button { display: inline-block; padding: 10px 20px; background-color: #861F41; color: white; text-decoration: none; border-radius: 5px; margin-top: 15px; }
                  </style>
                </head>
                <body>
                  <div class="container">
                    <div class="header">
                      <h2>New Feedback Submission: ${safeType}</h2>
                    </div>
                    <div class="content">
                      <p><span class="label">Feedback Type:</span> ${safeType}</p>
                      <p><span class="label">Site:</span> ${safeSite}</p>
                      <p><span class="label">Submitted:</span> ${new Date(timestamp).toLocaleString('en-US', {
                        timeZone: 'America/New_York',
                        dateStyle: 'full',
                        timeStyle: 'long'
                      })}</p>
                      <p><span class="label">Submitted By:</span> ${safeSubmitter}</p>
                      <div class="message-box">
                        <p class="label">Message:</p>
                        <p>${safeMessage}</p>
                      </div>
                      <p><span class="label">Feedback ID:</span> <code>${safeId}</code></p>
                    </div>
                    <div class="footer">
                      <p>This is an automated message from the VT Digital Libraries Platform Feedback System</p>
                      <p>Please do not reply to this email.</p>
                    </div>
                  </div>
                </body>
                </html>
              `
            },
            Text: {
              // Plain text version uses clean* variables directly —
              // no HTML here so no escapeHtml needed
              Data: `
New Feedback Submission: ${cleanFeedbackType}

Type: ${cleanFeedbackType}
Site: ${cleanSiteName}
Submitted: ${new Date(timestamp).toLocaleString()}
Submitted By: ${cleanSubmittedBy || 'Anonymous'}

Message:
${cleanMessage}

Feedback ID: ${feedbackId}

---
This is an automated message from the VT Digital Libraries Platform Feedback System.
              `
            }
          }
        }
      };

      await ses.sendEmail(emailParams).promise();
      console.log('Email sent successfully');
      emailSent = true;

      // Update DynamoDB record to mark email as sent
      await dynamodb.update({
        TableName: tableName,
        Key: { id: feedbackId },
        UpdateExpression: 'SET emailSent = :sent, emailSentAt = :time, updatedAt = :updated',
        ExpressionAttributeValues: {
          ':sent':    true,
          ':time':    timestamp,
          ':updated': timestamp
        }
      }).promise();

    } catch (emailErr) {
      console.error('Error sending email:', emailErr);
      emailError = emailErr.message;
      // Email failure does not fail the whole request —
      // the feedback is already saved to DynamoDB above
    }

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        success: true,
        message: 'Feedback submitted successfully',
        id: feedbackId,
        emailSent,
        ...(emailError && { emailError })
      })
    };

  } catch (error) {
    // error.message is logged to CloudWatch for your team to diagnose,
    // but NOT sent to the client — it can reveal DynamoDB table names,
    // AWS account details, and internal stack traces to an attacker
    console.error('Error processing feedback:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        success: false,
        message: 'Failed to submit feedback'
      })
    };
  }
};
