// functions/src/routes/eventRoutes.ts

import express from 'express';
import { getEventInfo, getEvents, createEvent, updateEvent, deleteEvent } from './controllers/eventController';
import { checkRoute } from "../middleware/checkRouteMiddleware";
import { authenticateAdmin } from '../middleware/authMiddleware';

const router = express.Router({mergeParams: true});

// POST a new event
// router.post('');

// GET an event
router.get('/:eventId', checkRoute, getEventInfo);

// GET all events
router.get('/', getEvents)

// UPDATE an event
router.put('/:eventId', authenticateAdmin, updateEvent)

// Create new event
router.post('/', authenticateAdmin, createEvent);

// DELETE an event
router.delete('/:eventId', authenticateAdmin, deleteEvent)

export default router;