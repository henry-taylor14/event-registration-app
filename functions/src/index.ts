// functions/src/index.ts
import { onRequest } from 'firebase-functions/v2/https';
import { sendConfirmationEmail } from './sendConfirmationEmail';
import { emailAllRegistrants } from './emailRegistrants';
import express from 'express';
import cors from 'cors';

import adminRoutes from './api/adminRoutes';
import groupRoutes from './api/groupRoutes';
import waiverRoutes from './api/waiverRoutes';
import eventRoutes from './api/eventRoutes';

const app = express();

// const PORT = process.env.PORT || 8080;

app.use(cors({ origin: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/admin', adminRoutes);
app.use('/events', eventRoutes);
app.use('/:eventId/groups', groupRoutes);
app.use('/waivers', waiverRoutes);

app.use((req, res) => {
  console.warn('404 Hit:', req.method, req.path); 
  res.status(404).json({ message: 'Route not found', path: req.path });
});

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found', path: req.path });
});
app.enable('strict routing');


// ✅ Export V2 HTTPS function
export const api = onRequest(app);

// ✅ Export callable functions
export { sendConfirmationEmail, emailAllRegistrants };
