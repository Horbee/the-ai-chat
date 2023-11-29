import { defineStore } from "pinia";
import { io, Socket } from "socket.io-client";

interface State {
  connected: boolean;
  socket: Socket | null;
}

export const useSocket = defineStore("socketStore", () => {
  const runtimeConfig = useRuntimeConfig();

  const state = reactive<State>({
    connected: false,
    socket: null,
  });

  const onConnected = () => (state.connected = true);
  const onDisconnected = () => (state.connected = false);

  const actions = {
    init: (token: string) => {
      console.log("initialize socket connection with token:", token);

      state.socket = io(runtimeConfig.public.serverUrl, {
        auth: { token },
      });

      state.socket.on("connect", onConnected);
      state.socket.on("disconnect", onDisconnected);
    },

    cleanup: () => {
      console.log("Cleanup socket connection");

      state.socket?.off("connect", onConnected);
      state.socket?.off("disconnect", onDisconnected);

      state.socket?.disconnect();
    },
  };

  return { ...toRefs(state), ...actions };
});
