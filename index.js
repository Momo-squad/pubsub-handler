import express from "express";
import { WebPubSubEventHandler } from "@azure/web-pubsub-express";

const app = express();

let handler = new WebPubSubEventHandler("farmap", {
  path: "/handle",
  onConnected: async (req) => {
    console.log(`${req.context.userId} connected`);
  },
  handleUserEvent: async (req, res) => {
    console.log(`[${req.context.userId}] ${req.data}`);
    res.success();
  },
});

app.use(handler.getMiddleware());

app.get("/", (req, res) => {
  res.send("working ...");
});

app.listen(8000, () => console.log("pubsub handler is running on 8000"));
