import { Socket } from "socket.io";

export const langSelected = (socket: Socket) => (lang: string) => {
  console.log(`${socket.id} selected new language: ${lang}`);

  socket.rooms.forEach((room) => {
    socket.leave(room);
  });

  socket.join(lang);
};
