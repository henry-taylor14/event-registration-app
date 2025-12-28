// functions/src/groupController.ts

import { Request, Response } from 'express';
import { db, admin } from '../../config/admin';
import { normalizeGroupName } from '../../helpers/normalizeName';
import { Timestamp } from 'firebase-admin/firestore';
import { FieldValue } from 'firebase-admin/firestore';
import { getPricePerPerson } from '../../helpers/ticketPrice';

export const getGroups = async (req: Request, res: Response): Promise<any> => {
  const { eventId } = req.params;

  try {
    const snapshot = await db.collection(`events/${eventId}/groups`).get();

    const groupsWithReceipts = await Promise.all(
      snapshot.docs.map(async (doc) => {
        const groupData = { groupId: doc.id, ...doc.data() };

        // Fetch receipts subcollection
        const receiptsSnapshot = await db
          .collection(`events/${eventId}/groups/${doc.id}/receipts`)
          .get();

        const receipts = receiptsSnapshot.docs.map(r => ({
          receiptId: r.id,
          ...r.data(),
        }));

        return { ...groupData, receipts };
      })
    );

    res.json(groupsWithReceipts);
  } catch (error) {
    console.error('Error fetching groups with receipts:', error);
    res.status(500).json({ error: 'Failed to fetch groups with receipts.' });
  }
};

export const createGroup = async (req: Request, res: Response): Promise<any> => {
    const { eventId } = req.params;
    const groupData = req.body;
    try {
      const eventRef = db.collection('events').doc(eventId);
      const eventSnap = await eventRef.get();

      if (!eventSnap.exists) {
      return res.status(404).json({ message: 'Event not found' });
      }

      const groupRef = eventRef.collection('groups').doc();
      
          const normalizedName = normalizeGroupName(groupData.groupName);
      
          const existingGroupsSnap = await db
          .collection(`events/${eventId}/groups`)
          .where('normalizedGroupName', '==', normalizedName)
          .get();
      
          if (!existingGroupsSnap.empty) {
            return res.status(409).json({ message: 'Group name already exists' });
          }
      
          const now = new Date();
          const pricePerPerson = getPricePerPerson(now);
      
          await groupRef.set({
          ...groupData,
          normalizedName,
          paymentStatus: 'unpaid',
          pricePerPerson,
          paymentTotal: groupData.groupSize * 35,
          registrationTime: Timestamp.fromDate(now),
          updateTime: '-',
          createdBy: 'admin',
          });
      
          return res.status(201).json({ message: 'Group registered successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to save group.' });
    }
}

export const createReceipt = async (req: Request, res: Response): Promise<any> => {
  try {
    const { eventId, groupId } = req.params;
    const {
      currentTxnGroupData,
      createdAt,
      receipt,
    } = req.body;

    if (!eventId || !groupId || !currentTxnGroupData || !receipt) {
      return res.status(400).json({ message: 'Missing required fields (eventId, groupId, or receipt)' });
    }

    const eventRef = db.collection('events').doc(eventId);
    const groupRef = eventRef.collection('groups').doc(groupId);
    const receiptRef = groupRef.collection('receipts').doc();

    console.log('group size', receipt.groupSize)
    console.log('total', receipt.paymentTotal)

    await receiptRef.set({
      receiptId: receiptRef.id,
      ...receipt,
    });

    console.log('FieldValue is:', FieldValue);
    console.log('increment is:', FieldValue?.increment);


    await groupRef.update({
      groupSize: FieldValue.increment(Number(receipt.groupSize)),
      paymentTotal: FieldValue.increment(Number(receipt.paymentTotal)),
      updateTime: createdAt,
    });

    return res.status(200).json({
      message: 'Receipt created and group updated successfully',
      receipt,
      receiptId: receiptRef.id,
      groupId,
      eventId,
    });
  } catch (error) {
    console.error('Error creating receipt:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};



// export const updateGroup = async (req: Request, res: Response): Promise<any> => {
//   try {
//     const { eventId } = req.params;
//     const {
//       currentTxnGroupData,
//       groupId,
//       createdAt,
//       paymentTotal,
//       receipt,
//     } = req.body;

//     if (!eventId || !groupId || !currentTxnGroupData) {
//       return res.status(400).json({ message: 'Missing required fields (eventId, groupId, or groupData)' });
//     }

//     const eventRef = db.collection('events').doc(eventId);
//     const eventSnap = await eventRef.get();

//     if (!eventSnap.exists) {
//       return res.status(404).json({ message: 'Event not found' });
//     }

//     const groupRef = eventRef.collection('groups').doc(groupId);
//     const groupSnap = await groupRef.get();

//     if (!groupSnap.exists) {
//       return res.status(404).json({ message: 'Group not found' });
//     }

//     const existingData = groupSnap.data();
//     const updatedGroupSize = (existingData?.groupSize || 0) + (currentTxnGroupData.groupSize || 0);
//     const updatedTotal = (existingData?.paymentTotal || 0) + (paymentTotal || 0);

//     const receiptRef = groupRef.collection('receipts').doc()

//     const cleanObject = (obj: Record<string, any>) =>
//       Object.fromEntries(Object.entries(obj).filter(([_, v]) => v !== undefined));

//     const updatePayload = cleanObject({
//       groupSize: updatedGroupSize,
//       paymentTotal: updatedTotal,
//       updateTime: createdAt,
//     });

//     try {
//       await groupRef.update(updatePayload);
//     } catch (err) {
//       console.error('Firestore update error:', err);
//       return res.status(500).json({ message: 'Failed to update group in Firestore' });
//     }

//       try {
//         await receiptRef.set({
//           receiptId: receiptRef.id,
//           ...receipt,
//         })

//       } catch (error) {
//         console.error('Error creating receipt:', error)
//         return res.status(500).json({ message: 'Server error' })
//       }

//     return res.status(200).json({
//       message: 'Group updated successfully',
//       receipt,
//       receiptId: receiptRef.id,
//       groupId,
//       eventId,
//     });
//   } catch (error) {
//     console.error('Error updating group:', error);
//     return res.status(500).json({ message: 'Error updating group' });
//   }
// };


const getWaiverInfo = async (req: Request, res: Response) => {
  try {
    const { eventId, groupId }= req.params;

    const snapshot = await db
      .collection('events')
      .doc(eventId)
      .collection('groups')
      .doc(groupId)
      .collection('waivers')
      .get();

    const waivers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json({ total: waivers.length, waivers });
  } catch (error) {
    console.error('Error getting waiver info:', error);
    res.status(500).send('Error getting waiver info');
  }
};

export const registerGroup = async (req: Request, res: Response): Promise<any> => {
  try {
    const { eventId } = req.params;
    const {
      currentTxnGroupData,
      groupId,
      createdAt,
      paymentTotal,
      receipt
    } = req.body;

    if (!eventId) {
      return res.status(400).json({ message: 'Missing eventId in route parameters' });
    }

    const eventRef = db.collection('events').doc(eventId);
    const eventSnap = await eventRef.get();
    if (!eventSnap.exists) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const groupRef = eventRef.collection('groups').doc(groupId);
    const normalizedName = normalizeGroupName(currentTxnGroupData.groupName);

    const existingGroupsSnap = await eventRef
      .collection('groups')
      .where('normalizedGroupName', '==', normalizedName)
      .get();

    if (!existingGroupsSnap.empty) {
      return res.status(409).json({ message: 'Group name already exists' });
    }

    const receiptRef = groupRef.collection('receipts').doc()
    
    await groupRef.set({
      eventId,
      groupId,
      ...currentTxnGroupData,
      normalizedGroupName: normalizedName,
      paymentStatus: 'unpaid',
      updateTime: '-',
      createdBy: 'public',
      numberCheckedIn: 0,
      paymentTotal,
      createdAt,
    });

    try {
      await receiptRef.set({
        receiptId: receiptRef.id,
        ...receipt
      })

    } catch (error) {
      console.error('Error creating receipt:', error)
      return res.status(500).json({ message: 'Server error' })
    }

    return res.status(201).json({
      message: 'Group registered successfully', 
      receiptId: receiptRef.id,
      receipt, 
      groupId, 
      eventId
    });
  } catch (error) {
    console.error('Error registering group:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const getGroup = async (req: Request, res: Response): Promise<any> => {
  const { eventId, groupId } = req.params;

  try {
    const groupDocRef = db.collection('events').doc(eventId).collection('groups').doc(groupId);
    const groupSnap = await groupDocRef.get();

    if (!groupSnap.exists) {
      return res.status(404).json({ message: 'Group not found' });
    }

    const groupData = groupSnap.data();

    const receiptsSnap = await groupDocRef.collection('receipts').get();
    const receipts = receiptsSnap.docs.map(doc => ({
      receiptId: doc.id,
      ...doc.data(),
    }));

    return res.status(200).json({
      groupId: groupSnap.id,
      ...groupData,
      receipts,
    });
  } catch (err) {
    console.error('Error retrieving group:', err);
    return res.status(500).json({ message: 'Error retrieving group' });
  }
};

export const updateGroup = async (req: Request, res: Response): Promise<any> => {
  const { eventId, groupId } = req.params;
  const { groupSize, leaderName, email, phone, numberCheckedIn } = req.body;

  try {
    const groupRef = db.doc(`events/${eventId}/groups/${groupId}`);
    await groupRef.update({ groupSize, leaderName, email, phone, numberCheckedIn });

    return res.status(200).json({ message: 'Group updated successfully' });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update group' });
  }
};

export const getReceipt = async (req: Request, res: Response): Promise<any> => {
  const { eventId, groupId, receiptId } = req.params;

  try {
    const receiptDocRef = db.collection('events').doc(eventId).collection('groups').doc(groupId).collection('receipts').doc(receiptId);
    const receiptSnap = await receiptDocRef.get();

    if (!receiptSnap.exists) {
      return res.status(404).json({ message: 'Receipt not found' });
    }

    const receiptData = receiptSnap.data();

    
    return res.json({ receiptId, receiptData });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error retrieving receipt' });
  }
};

export const deleteGroup = async (req: Request, res: Response): Promise<any> => {
    const { eventId, groupId } = req.params;
  
    try {
      await db.collection(`events/${eventId}/groups/`).doc(groupId).delete();
      res.send({ message: 'Group deleted successfully' });
    } catch (err) {
      res.status(500).send({ error: 'Failed to delete group' });
    }
}

export const deleteReceipt = async (req: Request, res: Response): Promise<any> => {
    const { eventId, groupId, receiptId } = req.params;
  
    try {
      await db.collection(`events/${eventId}/groups/${groupId}/receipts/`).doc(receiptId).delete();
      res.send({ message: 'Receipt deleted successfully' });
    } catch (err) {
      res.status(500).send({ error: 'Failed to delete receipt' });
    }
}

export const markGroupPaid = async (req: Request, res: Response): Promise<any> => {
    const { eventId, groupId } = req.params;
  
    try {
      await db.collection(`events/${eventId}/groups/`).doc(groupId).update({ paymentStatus: 'paid' });
      res.send({ message: 'Group marked as paid' });
    } catch (err) {
      res.status(500).send({ error: 'Failed to mark as paid' });
    }
}