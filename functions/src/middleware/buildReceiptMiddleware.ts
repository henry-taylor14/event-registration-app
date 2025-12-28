// buildReceiptMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import { buildReceipt } from '../helpers/buildReceipt';

export const buildReceiptMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { currentTxnGroupData, createdAt, subtotalPrice, fees, paymentTotal, pricePerPerson, priceTier } = req.body;

        const receipt = buildReceipt({
        currentTxnGroupData,
        pricePerPerson,
        subtotalPrice,
        fees,
        paymentTotal,
        priceTier,
        registrationTime: createdAt,
        });

        req.body.receipt = receipt;

        next();
    } catch (error) {
        console.error('Error creating receipt:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

