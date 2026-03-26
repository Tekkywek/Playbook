#!/usr/bin/env node
/**
 * Deletes all Firebase Auth users and clears Firestore data for this project.
 * Requires a service account with Firebase Admin privileges:
 *
 *   export GOOGLE_APPLICATION_CREDENTIALS=/path/to/serviceAccount.json
 *   # or
 *   export FIREBASE_SERVICE_ACCOUNT_JSON='{"type":"service_account",...}'
 *
 *   npm run reset-firebase
 *
 * Get a key: Firebase Console → Project settings → Service accounts → Generate new private key.
 */

import { readFileSync } from 'node:fs';
import admin from 'firebase-admin';

const PROJECT_ID = process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID ?? 'playbook-30d83';

function initAdmin() {
  if (admin.apps.length) return;
  const json = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (json) {
    const cred = JSON.parse(json);
    admin.initializeApp({ credential: admin.credential.cert(cred), projectId: PROJECT_ID });
    return;
  }
  const path = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (path) {
    const cred = JSON.parse(readFileSync(path, 'utf8'));
    admin.initializeApp({ credential: admin.credential.cert(cred), projectId: PROJECT_ID });
    return;
  }
  console.error(
    'Missing credentials. Set GOOGLE_APPLICATION_CREDENTIALS or FIREBASE_SERVICE_ACCOUNT_JSON.'
  );
  process.exit(1);
}

/** Delete a document and all nested subcollections (recursive). */
async function deleteDocumentRecursive(docRef) {
  const subs = await docRef.listCollections();
  for (const sub of subs) {
    const snap = await sub.get();
    for (const d of snap.docs) {
      await deleteDocumentRecursive(d.ref);
    }
  }
  await docRef.delete();
}

/** Delete every document in a top-level collection. */
async function clearCollection(collectionPath) {
  const db = admin.firestore();
  const col = db.collection(collectionPath);
  let snap = await col.limit(500).get();
  while (!snap.empty) {
    for (const d of snap.docs) {
      await deleteDocumentRecursive(d.ref);
    }
    snap = await col.limit(500).get();
  }
  console.log(`Cleared /${collectionPath}`);
}

async function deleteAllAuthUsers() {
  let nextPageToken;
  let total = 0;
  do {
    const res = await admin.auth().listUsers(1000, nextPageToken);
    for (const u of res.users) {
      await admin.auth().deleteUser(u.uid);
      total += 1;
    }
    nextPageToken = res.pageToken;
  } while (nextPageToken);
  console.log(`Deleted ${total} Auth user(s).`);
}

async function main() {
  initAdmin();
  console.log(`Resetting Firebase project: ${PROJECT_ID}`);
  await deleteAllAuthUsers();
  const collections = ['users', 'games', 'teams', 'leagues', 'activityFeed'];
  for (const c of collections) {
    try {
      await clearCollection(c);
    } catch (e) {
      console.warn(`Note: could not clear /${c}:`, e?.message ?? e);
    }
  }
  console.log('Done.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
