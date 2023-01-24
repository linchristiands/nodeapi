import { createRequire } from "module";
const require = createRequire(import.meta.url);
var admin = require("firebase-admin");

require("dotenv").config();

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.PROJECT_ID,
    privateKey: process.env.PRIVATE_KEY?.replace(/\\n/g, "\n"),
    clientEmail: process.env.CLIENT_EMAIL,
  }),
});

async function main() {
  try {
    let userRecord = await admin.auth().getUserByEmail("test@test.com");
    console.log("4bRXC1NyXgWxonbg6y6aPg7l1am1" == userRecord.uid);
  } catch (error) {
    return false;
  }
}
main();
