// src/config/admin.ts
import * as admin from 'firebase-admin';
import * as path from 'path';
import * as fs from 'fs';

const serviceAccountPath = path.resolve(__dirname, '../../scripts/service-account.json');
const isEmulator = !!process.env.FIRESTORE_EMULATOR_HOST;
const isLocalScript = process.env.NODE_ENV !== 'production';
const hasServiceAccount = fs.existsSync(serviceAccountPath);

if (!admin.apps.length) {
  if (isLocalScript && hasServiceAccount) {
    console.log('🔐 Initializing admin SDK with service account (local script)');
    admin.initializeApp({
      credential: admin.credential.cert(require(serviceAccountPath)),
      projectId: 'socalyfc-events',
    });
  } else {
    console.log('☁️ Initializing admin SDK with default credentials');
    admin.initializeApp({
      projectId: 'socalyfc-events',
    });
  }
}

const db = admin.firestore();

if (isEmulator) {
  console.log('🧪 Firestore emulator detected at', process.env.FIRESTORE_EMULATOR_HOST);
  db.settings({
    host: process.env.FIRESTORE_EMULATOR_HOST,
    ssl: false,
  });
}

const auth = admin.auth();

export { admin, db, auth };
