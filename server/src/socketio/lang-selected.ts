import { Socket } from "socket.io";
import { joinRoom } from "./join-room";

export const langSelected = (socket: Socket) => (lang: string) => {
  console.log(`${socket.id} selected new language: ${lang}`);

  joinRoom(socket, lang);
};
