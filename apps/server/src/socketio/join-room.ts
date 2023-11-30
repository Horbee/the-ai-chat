import { Socket } from "socket.io";
import Languages from "../langs.json";

export const joinRoom = (socket: Socket, lang: string) => {
  socket.rooms.forEach((room) => {
    if (Languages.some((lang) => lang.code === room)) {
      socket.leave(room);
    }
  });

  socket.join(lang);
};
