import { defineStore } from "pinia";
import { io } from "socket.io-client";
import { ref } from "vue";

export const useSocket = defineStore("socket", () => {
  const socket = io(import.meta.env.VITE_SERVER_URL, {
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
