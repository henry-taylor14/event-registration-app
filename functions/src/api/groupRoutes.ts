// functions/src/routes/groupRoutes.ts

import express from 'express';
import { getGroups, registerGroup, getGroup, getReceipt, createReceipt, createGroup, updateGroup, deleteGroup, deleteReceipt, markGroupPaid } from './controllers/groupController';
import { calculatePrice } from "../middleware/calculatePriceMiddleware";
import { verifyCaptcha } from "../middleware/verifyCaptchaMiddleware";
import { authenticateAdmin } from '../middleware/authMiddleware';
import { buildReceiptMiddleware } from '../middleware/buildReceiptMiddleware';

const router = express.Router({mergeParams: true});

// POST a new group
router.post('/registerGroup', verifyCaptcha, calculatePrice, buildReceiptMiddleware, registerGroup);

// Update group
router.put('/:groupId', authenticateAdmin, updateGroup);

// Update an existing group by adding a receipt
router.post('/:groupId/receipts', verifyCaptcha, calculatePrice, buildReceiptMiddleware, createReceipt)

// GET all groups for an event
router.get('/', getGroups);

// GET a group from an event
router.get('/:groupId', getGroup);

// GET a receipt from a group
router.get('/:groupId/receipts/:receiptId', getReceipt)

//Create new group
router.post('/', authenticateAdmin, createGroup);

// Delete group
router.delete('/:groupId', authenticateAdmin, deleteGroup);

// Delete receipt
router.delete('/:groupId/receipts/:receiptId', authenticateAdmin, deleteReceipt);

// Mark group as paid
router.post('/:groupId/markPaid', authenticateAdmin, markGroupPaid);

export default router;