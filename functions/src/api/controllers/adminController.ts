import { Request, Response } from 'express';
import { auth } from '../../config/admin';



// Admin controllers
export const setAdmin = async (req: Request, res: Response) => {
  const { uid } = req.body;

  try {
    await auth.setCustomUserClaims(uid, { admin: true });
    res.status(200).send(`Admin claim set for UID: ${uid}`);
  } catch (error) {
    console.error('Error setting admin claim:', error);
    res.status(500).send('Failed to set admin claim');
  }
}





// export const checkInReceipt = async (req: Request, res: Response): Promise<any> => {
//   const { eventId, groupId, receiptId } = req.params;

//   try {
//     const receiptRef = db.doc(`events/${eventId}/groups/${groupId}/receipts/${receiptId}`);
//     await receiptRef.update({ checkedIn: true });

//     return res.status(200).json({ message: 'Receipt checked in' });
//   } catch (error) {
//     return res.status(500).json({ error: 'Failed to check in receipt' });
//   }
// };

// export const markCheckIn = async (req: Request, res: Response): Promise<any> => {
//     const { eventId, groupId } = req.params;
  
//     try {
//       await db.collection(`events/${eventId}/groups/`).doc(groupId).update({ checkedIn: true });
//       res.send({ message: 'Group checked in successfully' });
//     } catch (err) {
//       res.status(500).send({ error: 'Failed to check in group' });
//     }
// }

