// functions/src/sendConfirmationEmail.ts
import { onCall } from 'firebase-functions/v2/https';
import { defineSecret } from 'firebase-functions/params';
import * as SibApiV3Sdk from 'sib-api-v3-sdk';

const brevoApiKey = defineSecret('BREVO_API_KEY');

type EmailData = {
  email: string;
  leaderName: string;
  groupId: string;
  groupName: string;
  transactionId: string;
  groupSize: number;
  total: number;
  waiverURL: string;
};

export const sendConfirmationEmail = onCall({ secrets: [brevoApiKey] }, async (request) => {
  const {
    email,
    leaderName,
    groupId,
    groupName,
    transactionId,
    groupSize,
    waiverURL,
    total: paymentTotal,
  } = request.data as EmailData;

  // Initialize Brevo API
  const apiKey = brevoApiKey.value();
  const defaultClient = SibApiV3Sdk.ApiClient.instance;
  defaultClient.authentications['api-key'].apiKey = apiKey;

  const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

  const sendSmtpEmail = {
    to: [{ email, name: leaderName }],
    sender: { name: 'Event Registration', email: 'mail@socalyfc.org' },
    subject: `Registration Confirmation: ${groupName}`,
    htmlContent: `
      <div style="font-family: Arial, sans-serif; line-height: 1.5;">
        <h2>Thank you for registering, ${leaderName}!</h2>
        <p>Here are your registration details:</p>
        <ul>
          <li><strong>Group Id:</strong> ${groupId}</li>
          <li><strong>Group Name:</strong> ${groupName}</li>
          <li><strong>Transaction ID:</strong> ${transactionId}</li>
          <li><strong>Group Size:</strong> ${groupSize}</li>
          <li><strong>Total Paid:</strong> $${paymentTotal.toFixed(2)}</li>
        </ul>
        <p>Your group can fill out waivers here: ${waiverURL}?groupId=${groupId}.</p>
        <p>If you have any questions, email us at mail@socalyfc.org.</p>
      </div>
    `,
  };

  try {
    const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
    return { success: true, messageId: response.messageId };
  } catch (error: any) {
    console.error('Email send failed:', error.response?.body || error.message);
    throw new Error('Failed to send confirmation email.');
  }
});
