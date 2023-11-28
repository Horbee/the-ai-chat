<template>
  <v-list lines="two" class="flex-grow-1">
    <v-list-item
      v-for="item in messages"
      :key="JSON.stringify(item.message)"
      :title="item.user"
      :subtitle="item.message.translations[0].text"
    ></v-list-item>
  </v-list>
</template>

<script setup lang="ts">
import { useSocket } from "@/stores/socket";
import type { Message } from "@/models/Message";

const messages = ref<Message[]>([]);

const { socket } = useSocket();

socket.on("incoming_message", (message: Message) => {
  console.log(message);
  messages.value.push(message);
});
</script>
