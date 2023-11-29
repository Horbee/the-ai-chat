import { Server } from "socket.io";

export const emitOnlineUserList = (
  io: Server,
  onlineUsers: { [key: string]: { name?: string } }
) => {
  io.emit(
    "onlineusers",
    Object.values(onlineUsers).map((u) => u.name)
  );
};
