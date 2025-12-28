import { getFunctions, httpsCallable } from 'firebase/functions';

export const sendConfirmationEmail = async ({
  email,
  leaderName,
  groupId,
  groupName,
  transactionId,
  groupSize,
  total,
}: {
  email: string;
  leaderName: string;
  groupId: string;
  groupName: string;
  transactionId: string;
  groupSize: number;
  total: number;
}) => {
  const functions = getFunctions();
  const sendEmailFn = httpsCallable(functions, 'sendConfirmationEmail');
  return await sendEmailFn({ email, leaderName, groupId, groupName, transactionId, groupSize, total });
};
