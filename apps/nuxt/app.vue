<template>
  <NuxtLayout>
    <v-app>
      <NuxtPage />
    </v-app>
  </NuxtLayout>
</template>

<script setup lang="ts">
const socket = useSocket();
const { data } = useAuth();

const token = computed(() => data.value?.user.token || "");

watch(
  token,
  (newToken, oldToken, onCleanup) => {
    onCleanup(socket.cleanup);

    socket.init(newToken);
  },
  { immediate: true }
);
</script>
