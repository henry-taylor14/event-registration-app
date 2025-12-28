
import { onCall } from 'firebase-functions/v2/https';
import * as logger from 'firebase-functions/logger';
import axios from 'axios';
import { db, admin } from './config/admin';

interface InputData {
  eventId: string;
  subject: string;
  message: string;
}

export const emailAllRegistrants = onCall<InputData>(async (request) => {
  const { eventId, subject, message } = request.data;

  if (!eventId || !subject || !message) {
    throw new Error('Missing required fields.');
  }

  try {
    // Get all groups for the event
    const groupsSnapshot = await db.collection('events').doc(eventId).collection('groups').get();
    const emailSet = new Map<string, any>();

    for (const groupDoc of groupsSnapshot.docs) {
      const groupData = groupDoc.data();
      const groupId = groupDoc.id;

      // Get all receipts for the group
      const receiptsSnapshot = await groupDoc.ref.collection('receipts').get();

      for (const receiptDoc of receiptsSnapshot.docs) {
        const receipt = receiptDoc.data();
        const email = receipt.email?.toLowerCase().trim();

        if (email && !emailSet.has(email)) {
          emailSet.set(email, {
            email,
            leaderName: receipt.leaderName || '',
            groupName: receipt.groupName || '',
          });
        }
      }
    }

    const uniqueRecipients = Array.from(emailSet.values());
    logger.info(`📨 Sending ${uniqueRecipients.length} emails`);

    for (const recipient of uniqueRecipients) {
      await sendBrevoEmail({
        to: recipient.email,
        subject,
        message,
      });
    }

    return { success: true, count: uniqueRecipients.length };
  } catch (err) {
    logger.error('❌ Failed to send emails:', err);
    throw new Error('Email sending failed');
  }
});

async function sendBrevoEmail({
  to,
  subject,
  message,
}: {
  to: string;
  subject: string;
  message: string;
}) {
  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = 'events@socalyfc.org';
  const senderName = 'So Cal YFC';

  if (!apiKey) throw new Error('Missing Brevo API key');

  await axios.post(
    'https://api.brevo.com/v3/smtp/email',
    {
      sender: { name: senderName, email: senderEmail },
      to: [{ email: to }],
      subject,
      htmlContent: `<p>${message}</p>`,
    },
    {
      headers: {
        'api-key': apiKey,
        'Content-Type': 'application/json',
      },
    }
  );
}