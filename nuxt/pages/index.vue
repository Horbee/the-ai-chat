<script setup lang="ts">
import { storeToRefs } from "pinia";

import Languages from "@/langs.json";
import { useSocket } from "@/stores/socket";

const { signOut } = useAuth();

useHead({ title: "The AI Chat" });

definePageMeta({ middleware: ["auth"] });

const socketStore = useSocket();
const { socket } = socketStore;
const { connected } = storeToRefs(socketStore);

const currentMessage = ref("");
const userName = ref("");
const preferredLanguage = ref("");

const sendMessage = () => {
  if (!currentMessage.value || !userName.value || !connected.value) return;
  console.log("send");

  socket.emit("new_message", {
    message: currentMessage.value,
    user: userName.value,
    lang: preferredLanguage.value,
  });

  currentMessage.value = "";
};

watch(preferredLanguage, (lang) => {
  socket.emit("lang_selected", lang);
});

const btnEnabled = computed(
  () => currentMessage.value && userName.value && connected.value
);
</script>

<template>
  <h1>Hello World</h1>
  <button @click="signOut()">Singout</button>

  <form @submit.prevent="sendMessage">
    <div>
      <label
        >Your Name:
        <input type="text" v-model="userName" />
      </label>

      <label
        >Preferred Language:
        <select v-model="preferredLanguage">
          <option disabled value="">Please select one</option>
          <option v-for="lang in Languages" :value="lang.code">
            {{ lang.name }}
          </option>
        </select>
      </label>
    </div>

    <div>
      <label
        >Your message:
        <input type="text" v-model="currentMessage" />
      </label>
    </div>
    <button type="submit" :disabled="!btnEnabled">Send</button>
  </form>

  <MessageList />
</template>
