import { defineStore } from "pinia";

import type { Message } from "@/models/Message";

export const useMessages = defineStore("messageStore", () => {
  const { socket } = useSocket();

  const messages = ref<Message[]>([]);

  socket.on("message:incoming", (message: Message) => {
    console.log(message);
    messages.value.push(message);
  });

  const emitMessage = (message: string, username: string) => {
    socket.emit("message:send", { message, username });
  };

  const $dispose = () => {
    console.log("calling dispose");
    socket.off("message:incoming");
  };

  return { messages, emitMessage, $dispose };
});
