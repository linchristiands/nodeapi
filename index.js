import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { initializeApp } from "firebase/app";
import { createRequire } from "module";
import uuid4 from "uuid4";
const require = createRequire(import.meta.url);

const firebaseConfig = {
  apiKey: "AIzaSyATxMsOvtLNJcrd3zWzhOBHjVvPt2Hnb0E",
  authDomain: "kubernetestest-373803.firebaseapp.com",
  projectId: "kubernetestest-373803",
  storageBucket: "kubernetestest-373803.appspot.com",
  messagingSenderId: "808725214266",
  appId: "1:808725214266:web:4e871be87b66e17ed67103",
  measurementId: "G-7CLDFSTVTH",
};
const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);

const { Spanner } = require("@google-cloud/spanner");
const projectId = "kubernetestest-373803";
const instanceId = "spannertest";
const databaseId = "testdb";
const spanner = new Spanner({
  projectId: projectId,
});

const instance = spanner.instance(instanceId);

const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ルーティングの設定
app.get("/", async (req, res) => {
  res.send("Hello World");
});

app.get("/users", async (req, res) => {
  const database = instance.database(databaseId);
  try {
    const query = {
      sql: "SELECT * from users",
    };
    const [rows] = await database.run(query);
    res.send(rows);
  } catch (err) {
    throw err;
  } finally {
    // Close the database when finished.
    await database.close();
  }
});

app.post("/auth", async (req, res) => {
  let email = req.body.email;
  let pw = req.body.password;
  try {
    let userCred = await signInWithEmailAndPassword(auth, email, pw);
    res.send(true);
  } catch (error) {
    console.log(error);
    throw err;
  }
});
app.post("/register", async (req, res) => {
  let email = req.body.email;
  let pw = req.body.password;
  try {
    await createUserWithEmailAndPassword(auth, email, pw);
    res.send(true);
  } catch (error) {
    console.log(error);
    throw err;
  }
});

app.post("/contact", async (req, res) => {
  const database = instance.database(databaseId);
  let email = req.body.email;
  let title = req.body.title;
  let body = req.body.body;
  const contactsTable = database.table("contacts");
  var id = uuid4();
  const data = {
    id: id,
    email: email,
    title: title,
    body: body,
    createdAt: "spanner.commit_timestamp()",
  };
  try {
    await contactsTable.insert(data);
    console.log("Inserted data.");
    res.send(true);
  } catch (err) {
    console.error("ERROR:", err);
    throw err;
  } finally {
    // Close the database when finished
    database.close();
  }
});

app.post("/getcontactsent", async (req, res) => {
  const database = instance.database(databaseId);
  let email = req.body.email;
  try {
    const query = {
      sql: "SELECT * from contacts WHERE email='" + email + "';",
    };
    const [rows] = await database.run(query);
    res.send(rows);
  } catch (err) {
    throw err;
  } finally {
    // Close the database when finished.
    await database.close();
  }
});

const port = parseInt(process.env.PORT) || 8080;

app.listen(port, () => {
  console.log(`server started on port ${port}`);
});
