<template>
  <v-list lines="two" class="flex-grow-1">
    <v-list-item
      v-for="item in messages"
      :key="JSON.stringify(item.translations)"
      :title="item.username"
      :subtitle="item.translations[0].text"
    ></v-list-item>
  </v-list>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useMessages } from "@/stores/message";

const { messages } = storeToRefs(useMessages());
</script>
