// lib/firebase.ts
// Small compatibility wrapper to match existing import paths across the repo.
import app, { auth, db, storage } from "./firebaseConfig";

export { app, auth, db, storage };
export default app;
