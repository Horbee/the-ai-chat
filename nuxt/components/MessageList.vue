<template>
  <div>
    <ul>
      <li v-for="item in messages">
        <span>{{ item.user }}: </span>
        <span>{{ item.message.translations[0].text }}</span>
      </li>
    </ul>
  </div>
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
