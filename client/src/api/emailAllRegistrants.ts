import { getFunctions, httpsCallable } from 'firebase/functions';

export const sendCustomEmailToRegistrants = async (
  eventId: string,
  subject: string,
  message: string
) => {
  const functions = getFunctions();
  const fn = httpsCallable(functions, 'sendEmailToEventRegistrants');
  return await fn({ eventId, subject, message });
};
