import express from "express";
import { WebPubSubEventHandler } from "@azure/web-pubsub-express";
import { WebPubSubServiceClient } from "@azure/web-pubsub";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const { PUBSUB_URI } = process.env;
console.log(PUBSUB_URI);
const app = express();

let serviceClient = new WebPubSubServiceClient(PUBSUB_URI, "farmap");

let handler = new WebPubSubEventHandler("farmap", {
  path: "/handle",
  onConnected: async (req) => {
    console.log(`${req.context.userId} connected`);
  },
  handleUserEvent: async (req, res) => {
    let data = { userId: req.context.userId, data: req.data };
    serviceClient.sendToAll(JSON.stringify(data));
    fs.writeFileSync("./data.txt", `${JSON.stringify(data)} \n`);
    res.success();
  },
});

app.use(handler.getMiddleware());

app.get("/", (req, res) => {
  let data = fs.readFileSync("./data.txt", { encoding: "utf-8" });
  res.send(data);
});

app.listen(process.env.PORT || 8080, () =>
  console.log("pubsub handler is running on 8000")
);
