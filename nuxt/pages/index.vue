<script setup lang="ts">
import { storeToRefs } from "pinia";

import Languages from "@/langs.json";
import { useSocket } from "@/stores/socket";
import { useMessages } from "@/stores/message";

useHead({ title: "The AI Chat" });
definePageMeta({ middleware: ["auth"] });

const { signOut, data: sessionData } = useAuth();
const messagesStore = useMessages();
const socketStore = useSocket();
const { connected, socket } = storeToRefs(socketStore);

const currentMessage = ref("");
const preferredLanguage = ref("");
const isUsernameModalOpen = ref(false);

const userName = computed(() => sessionData.value?.user.name || "");
const btnEnabled = computed(
  () => currentMessage.value && userName.value && connected.value
);

onMounted(() => {
  if (!userName.value) isUsernameModalOpen.value = true;
});

const sendMessage = () => {
  if (!currentMessage.value || !userName.value || !connected.value) return;

  messagesStore.sendMessage(currentMessage.value, userName.value);

  currentMessage.value = "";
};

watch(preferredLanguage, (lang) => {
  socket.value?.emit("language:selected", lang);
});

watch(
  [userName, socket],
  ([userName, socket]) => {
    if (userName) socket?.emit("username:update", userName);
  },
  { immediate: true }
);
</script>

<template>
  <UsernameDialog
    :is-open="isUsernameModalOpen"
    @update:is-open="isUsernameModalOpen = $event"
    :username="userName"
  />

  <v-container class="d-flex flex-column h-screen">
    <div class="d-flex">
      <h1>Hello {{ userName }}!</h1>
      <v-btn
        icon="$edit"
        variant="plain"
        @click="isUsernameModalOpen = true"
      ></v-btn>
    </div>
    <v-btn
      variant="outlined"
      color="orange"
      @click="signOut()"
      class="align-self-start"
      >Signout</v-btn
    >

    <v-chip-group selected-class="text-primary" :mandatory="true">
      <v-chip
        v-for="lang in Languages"
        :key="lang.code"
        @click="preferredLanguage = lang.code"
      >
        {{ lang.name }}
      </v-chip>
    </v-chip-group>

    <v-form @submit.prevent="sendMessage">
      <div class="d-flex">
        <v-text-field
          label="Your message:"
          v-model="currentMessage"
          class="mr-2"
        ></v-text-field>

        <v-btn type="submit" class="mt-2" :disabled="!btnEnabled">Send</v-btn>
      </div>
    </v-form>

    <MessageList />
    <OnlineUserList />
  </v-container>
</template>
