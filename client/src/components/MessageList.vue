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

<script setup>
import { ref } from "vue";
import { useSocket } from "../stores/socket";

const messages = ref([]);

const { socket } = useSocket();

socket.on("incoming_message", (args) => {
  console.log(args);
  messages.value.push(args);
});
</script>
