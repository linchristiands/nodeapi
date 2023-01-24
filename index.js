import { createRequire } from "module";
import uuid4 from "uuid4";
import { checkIfUidCorrespondToEmail } from "./util.js";

const require = createRequire(import.meta.url);

const { Spanner } = require("@google-cloud/spanner");
const projectId = process.env.PROJECT_ID;
const instanceId = process.env.INSTANCE_ID;
const databaseId = process.env.DATABASE_ID;
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
/* app.get("/", async (req, res) => {
  res.send("Hello World");
}); */

app.post("/contact", async (req, res) => {
  let uid = req.body.uid;
  let email = req.body.email;
  let title = req.body.title;
  let body = req.body.body;
  if (uid == "" || email == "" || title == "" || body == "")
    throw new Error("Missing parameters");
  let result = await checkIfUidCorrespondToEmail(uid, email);
  if (!result) {
    console.log("User not registered, can't use this API");
    throw new Error("User not registered, can't use this API");
  }
  const database = instance.database(databaseId);

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
  let uid = req.body.uid;
  let email = req.body.email;
  if (uid == "" || email == "") throw new Error("Missing parameters");
  let result = await checkIfUidCorrespondToEmail(uid, email);
  if (!result) {
    console.log("User not registered, can't use this API");
    throw new Error("User not registered, can't use this API");
  }
  const database = instance.database(databaseId);

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
