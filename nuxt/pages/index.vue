<script setup lang="ts">
import { storeToRefs } from "pinia";

import Languages from "@/langs.json";
import { useSocket } from "@/stores/socket";

const { signOut, data: sessionData } = useAuth();

useHead({ title: "The AI Chat" });

definePageMeta({ middleware: ["auth"] });

const isUsernameModalOpen = ref(false);

onMounted(() => {
  if (!sessionData.value?.user.name) {
    isUsernameModalOpen.value = true;
  }
});

const socketStore = useSocket();
const { socket } = socketStore;
const { connected } = storeToRefs(socketStore);

const currentMessage = ref("");
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

const userName = computed(() => sessionData.value?.user.name || "");

const btnEnabled = computed(
  () => currentMessage.value && userName.value && connected.value
);
</script>

<template>
  <UsernameDialog
    :is-open="isUsernameModalOpen"
    @update:is-open="isUsernameModalOpen = $event"
  />

  <v-container class="d-flex flex-column h-screen">
    <div class="d-flex">
      <h1>Hello {{ sessionData?.user.name }}!</h1>
      <v-btn icon="$edit" variant="plain"></v-btn>
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
  </v-container>
</template>
