import { defineStore } from "pinia";

import type { Message } from "@repo/types";

export const useMessages = defineStore("messageStore", () => {
  const { socket } = storeToRefs(useSocket());

  const messages = ref<Message[]>([]);

  const incomingMessage = (message: Message) => {
    console.log(message);
    messages.value.push(message);
  };

  const sendMessage = (message: string, username: string) => {
    socket.value?.emit("message:send", { message, username });
  };

  const init = () => {
    console.log("Init messages store");
    socket.value?.on("message:incoming", incomingMessage);
  };

  const cleanup = () => {
    console.log("Cleaning up messages store");
    socket.value?.off("message:incoming", incomingMessage);
  };

  watch(
    socket,
    (newSocket, oldSocket, onCleanup) => {
      onCleanup(cleanup);
      init();
    },
    { immediate: true }
  );

  return { messages, sendMessage };
});
