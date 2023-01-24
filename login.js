import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
//const { auth } = require("./firebase");
const { Spanner } = require("@google-cloud/spanner");
const projectId = "kubernetestest-373803";
const instanceId = "spannertest";
const databaseId = "testdb";
const spanner = new Spanner({
  projectId: projectId,
});
