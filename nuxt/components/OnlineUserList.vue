<template>
  <v-list class="d-flex bg-grey-darken-3 mb-2">
    <v-list-item v-for="user in onlineUsers" :key="user">
      <v-list-item-title
        ><span
          class="bg-green-darken-1 d-inline-block rounded-circle"
          style="width: 10px; height: 10px"
        ></span>
        {{ user }}</v-list-item-title
      >
    </v-list-item>
  </v-list>
</template>

<script setup lang="ts">
const { socket } = useSocket();

const onlineUsers = ref([]);

onMounted(() => {
  socket.on("onlineusers", (users) => (onlineUsers.value = users));
});
</script>
