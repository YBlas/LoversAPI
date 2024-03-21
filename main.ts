//@deno-types="npm:@types/express@4"

import express, { Request, Response } from "npm:express";
import {
  Database,
  MongoClient,
} from "https://deno.land/x/mongo@v0.32.0/mod.ts";

import { load } from "https://deno.land/std@0.218.0/dotenv/mod.ts";

const env = await load();
const password = env["PASS"];
const user = env["USER"];

const connectMongoDB = async (): Promise<Database> => {
  const mongo_usr = user;
  const mongo_pwd = password;
  const db_name = "supermondongos";
  const mongo_uri = "mongomake.3ta2r.mongodb.net";
  const mongo_url = `mongodb+srv://${mongo_usr}:${mongo_pwd}@${mongo_uri}/${db_name}?authMechanism=SCRAM-SHA-1`;
  const client = new MongoClient();
  await client.connect(mongo_url);
  const db = client.database(db_name);
  return db;
};

const db = await connectMongoDB();
const lovers = db.collection("lovers");

type comment = {
  user: string;
  message: string;
};

type Lover = {
  name: string;
  password: string;
  age: number;
  sex: string;
  description: string;
  hobbies: string[];
  photo: string;
  comments: comment[];
};

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response): void => {
  lovers
    .find({})
    .toArray()
    .then((e) => {
      const filteredE = e.map((e) => {
        delete e.password;
        return e;
      });
      res.json(filteredE);
    });
});

app.post("/login", async (req: Request, res: Response) => {
  const { name, password } = req.body;
  const existingLover = await lovers.findOne({ name });
  if (existingLover) {
    if (existingLover.password === password) {
      res.json({ message: "Login successful" });
    } else {
      res.status(401).json({ error: "Unauthorized" });
    }
  } else {
    res.status(404).json({ error: "Lover not found" });
  }
});

app.get("/hobbies", async (req: Request, res: Response) => {
  const allHobbies = await lovers.distinct("hobbies");
  res.json(allHobbies);
});

app.post("/", async (req: Request, res: Response) => {
  const newLover: Lover = req.body;

  if (
    !newLover.name ||
    !newLover.password ||
    !newLover.age ||
    !newLover.sex ||
    !newLover.description ||
    !newLover.hobbies ||
    !newLover.photo ||
    !newLover.comments ||
    newLover.name === "" ||
    newLover.password === ""
  ) {
    res.status(400).json({ error: "Missing fields" });
    return;
  }
  const photo = newLover.photo;
  const validPhoto = photo.match(/\.(jpeg|jpg|png)$/);
  if (!validPhoto) {
    res.status(400).json({ error: "Invalid photo" });
    return;
  }

  const existingLover = await lovers.findOne({ name: newLover.name });
  if (existingLover) {
    res.status(400).json({ error: "Lover already exists" });
    return;
  } else {
    await lovers.insertOne(newLover);
    res.json(newLover);
  }
});

app.get("/:name", async (req: Request, res: Response) => {
  const name = req.params.name;
  const lover = await lovers.findOne({ name });
  if (lover) {
    delete lover.password;
    res.json(lover);
  } else {
    res.status(404).json({ error: "Lover not found" });
  }
});

app.put("/:name", async (req: Request, res: Response) => {
  const name = req.params.name;
  const newLover: Lover = req.body;
  const existingLover = await lovers.findOne({ name });
  if (existingLover) {
    await lovers.updateOne({ name }, { $set: newLover });
    res.json(newLover);
  } else {
    res.status(404).json({ error: "Lover not found" });
  }
});

app.delete("/:name", async (req: Request, res: Response) => {
  const name = req.params.name;
  const { password } = req.body;
  const existingLover = await lovers.findOne({ name });
  if (existingLover) {
    if (existingLover.password === password) {
      await lovers.deleteOne({ name });
      res.json({ message: "Lover deleted" });
    } else {
      res.status(401).json({ error: "Unauthorized" });
    }
  } else {
    res.status(404).json({ error: "Lover not found" });
  }
});

app.post("/:name/comment", async (req: Request, res: Response) => {
  const name = req.params.name;
  const { user, password, message } = req.body;
  const existingLover = await lovers.findOne({ name });
  if (existingLover) {
    if (existingLover.password === password) {
      const comment = {
        user,
        message,
      };
      await lovers.updateOne({ name }, { $push: { comments: comment } });
      res.json({ message: "Comment added" });
    } else {
      res.status(401).json({ error: "Unauthorized" });
    }
  } else {
    res.status(404).json({ error: "Lover not found" });
  }
});

app.delete("/:name/comment", async (req: Request, res: Response) => {
  const name = req.params.name;
  const { user, password } = req.body;
  const existingLover = await lovers.findOne({ name });
  if (existingLover) {
    if (existingLover.password === password) {
      await lovers.updateOne({ name }, { $pull: { comments: { user } } });
      res.json({ message: "Comments deleted" });
    } else {
      res.status(401).json({ error: "Unauthorized" });
    }
  } else {
    res.status(404).json({ error: "Lover not found" });
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
