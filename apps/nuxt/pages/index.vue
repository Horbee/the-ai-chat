<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useSocket } from "@/stores/socket";
import { useMessages } from "@/stores/message";

useHead({ title: "The AI Chat" });
definePageMeta({ middleware: ["auth"] });

const { signOut, data: sessionData } = useAuth();
const messagesStore = useMessages();
const socketStore = useSocket();
const { connected, socket } = storeToRefs(socketStore);

const currentMessage = ref("");
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

watch(
  [userName, socket],
  ([userName, socket]) => {
    if (userName) socket?.emit("username:update", userName);
  },
  { immediate: true }
);

const token = computed(() => sessionData.value?.user.token || "");

watch(
  token,
  (newToken, oldToken, onCleanup) => {
    onCleanup(socketStore.cleanup);

    socketStore.init(newToken);
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

    <PreferredLanguageSelector />

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
