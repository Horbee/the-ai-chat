import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";
import { createServer } from "node:http";
import { Server } from "socket.io";

dotenv.config();

const corsConfig = {
  origin: process.env.CORS_ORIGIN,
};

const app = express();
const server = createServer(app);
const io = new Server(server, { cors: corsConfig });

app.use(cors(corsConfig));

const port = process.env.PORT || 8888;

const getTranslation = async (lang, text) => {
  const key = process.env.DEEPL_KEY;
  const { data } = await axios.post(
    "https://api-free.deepl.com/v2/translate",
    {
      text: [text],
      target_lang: lang,
    },
    { headers: { Authorization: `DeepL-Auth-Key ${key}` } }
  );

  return { lang, message: data };
};

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
  console.log("a user connected");
  socket.join("EN");

  socket.on("new_message", async ({ user, message }) => {
    console.log("new_message", { user, message });
    const rooms = io.of("/").adapter.rooms;
    const langs = [...rooms.keys()];

    const translations = await Promise.all(
      langs.map((l) => getTranslation(l, message))
    );

    translations.forEach(({ lang, message }) => {
      io.to(lang).emit("incoming_message", { user, message });
    });
  });

  socket.on("lang_selected", (lang) => {
    console.log("lang_selected", lang);
    socket.rooms.forEach((r) => {
      socket.leave(r);
    });
    socket.join(lang);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "UP" });
});

server.listen(port, () => {
  console.log("server running at port: ", port);
});
