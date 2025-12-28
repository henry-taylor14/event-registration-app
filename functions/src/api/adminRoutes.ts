import express from 'express';
import { authenticateAdmin } from '../middleware/authMiddleware';
import {  
        setAdmin, 
    } from './controllers/adminController';

const router = express.Router();

// Set custom claim
router.post('/setAdmin', setAdmin);

// Send mass email
router.post('/events/:eventId/email', authenticateAdmin, async (req, res) => {
  // Trigger Mailchimp or email function
});

export default router;
