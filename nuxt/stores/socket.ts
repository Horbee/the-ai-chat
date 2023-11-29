import { defineStore } from "pinia";
import { io } from "socket.io-client";

export const useSocket = defineStore("socketStore", () => {
  const runtimeConfig = useRuntimeConfig();

  const connected = ref(false);

  const socket = io(runtimeConfig.public.serverUrl, {
    query: { token: "test token" },
  });

  socket.on("connect", () => {
    connected.value = true;
  });

  socket.on("disconnect", () => {
    connected.value = false;
  });

  return { socket, connected };
});
