import { createRequire } from "module";
const require = createRequire(import.meta.url);
var admin = require("firebase-admin");

admin.initializeApp();

export const adminAuth = admin.auth();
