import express from "express";
import cors from "cors";
import { createServer } from "node:http";
import { Server } from "socket.io";
import { corsConfig } from "./config/cors-config";
import { env } from "./config/env-config";
import { newMessage } from "./socketio/new-message";
import { langSelected } from "./socketio/lang-selected";

const app = express();
const server = createServer(app);
const io = new Server(server, { cors: corsConfig });

app.use(cors(corsConfig));

io.use((socket, next) => {
  if (socket.handshake.query && socket.handshake.query.token) {
    // jwt.verify(
    //   socket.handshake.query.token,
    //   "SECRET_KEY",
    //   function (err, decoded) {
    //     if (err) return next(new Error("Authentication error"));
    //     socket.decoded = decoded;
    //     next();
    //   }
    // );
    const token = socket.handshake.query.token;
    if (token === "test token") next();
    else next(new Error("Authentication error"));
  } else {
    next(new Error("Authentication error"));
  }
}).on("connection", (socket) => {
  console.log(`User connected, id: ${socket.id}`);
  socket.join("EN");

  socket.on("new_message", newMessage(io));

  socket.on("lang_selected", langSelected(socket));

  socket.on("disconnect", () => {
    console.log("User disconnected.");
  });
});

const port = env.PORT;

app.get("/health", (req, res) => {
  res.status(200).json({ status: "UP" });
});

server.listen(port, () => {
  console.log("server running at port: ", port);
});
