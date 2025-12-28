// calculatePriceMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import { db } from '../config/admin'
import { paypalFeeCalculator } from '../helpers/paypalFeeCalculator'
import { Timestamp } from 'firebase-admin/firestore';

export const calculatePrice = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const { eventId, groupId: incomingGroupId } = req.params;
    const { currentTxnGroupData } = req.body;

    if (!eventId) {
      return res.status(400).json({ error: 'Missing eventId' });
    }
    if (!currentTxnGroupData?.groupSize) {
      return res.status(400).json({ error: 'Missing groupSize' });
    }

    const groupRef = incomingGroupId
      ? db.collection(`events/${eventId}/groups`).doc(incomingGroupId)
      : db.collection(`events/${eventId}/groups`).doc();

    const groupId = groupRef.id;

    const eventSnap = await db.doc(`events/${eventId}`).get();
    if (!eventSnap.exists) {
      return res.status(404).json({ error: 'Event not found' });
    }

    const eventData = eventSnap.data();
    const now = new Date();
    const createdAt = Timestamp.fromDate(now);

    const earlyBirdDeadline = eventData!.earlyBirdPriceDeadline?.toDate?.();
    const regularDeadline = eventData!.regularPriceDeadline?.toDate?.();

    let pricePerPerson = 0;
    let priceTier = '';

    if (createdAt < earlyBirdDeadline) {
      pricePerPerson = 20;
      priceTier = 'early';
    } else if (createdAt < regularDeadline) {
      pricePerPerson = 25;
      priceTier = 'regular';
    } else {
      pricePerPerson = 30;
      priceTier = 'late';
    }

    const subtotalPrice = currentTxnGroupData.groupSize * pricePerPerson;
    const fees = paypalFeeCalculator(subtotalPrice);
    const totalPrice = subtotalPrice + fees;

    req.body.groupId = groupId;
    req.body.currentTxnGroupData = currentTxnGroupData;
    req.body.createdAt = createdAt;
    req.body.pricePerPerson = pricePerPerson;
    req.body.subtotalPrice = subtotalPrice;
    req.body.fees = fees;
    req.body.paymentTotal = totalPrice;
    req.body.priceTier = priceTier;

    next();
  } catch (error) {
    console.error('Error calculating price:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};