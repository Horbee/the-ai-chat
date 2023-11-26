import { defineStore } from "pinia";
import { io } from "socket.io-client";

export const useSocket = defineStore("socket", () => {
  const runtimeConfig = useRuntimeConfig();

  const socket = io(runtimeConfig.public.serverUrl, {
    query: { token: "test token" },
  });
  const connected = ref(false);

  socket.on("connect", () => {
    connected.value = true;
  });

  socket.on("disconnect", () => {
    connected.value = false;
  });

  return { socket, connected };
});
