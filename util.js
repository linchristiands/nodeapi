import { adminAuth } from "./firebase.js";

export const checkIfUidCorrespondToEmail = async (uid, email) => {
  try {
    let userRecord = await adminAuth.getUserByEmail(email);
    return uid == userRecord.uid;
  } catch (error) {
    return false;
  }
};
