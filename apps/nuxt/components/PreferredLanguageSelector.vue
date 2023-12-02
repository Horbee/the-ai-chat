<template>
  <v-chip-group
    selected-class="text-primary"
    :mandatory="true"
    v-model="preferredLanguageIndex"
  >
    <v-chip v-for="lang in Languages" :key="lang.code">
      {{ lang.name }}
    </v-chip>
  </v-chip-group>
</template>

<script setup lang="ts">
import type { Language } from "@repo/types";

const runtimeConfig = useRuntimeConfig();
const { data: Languages } = await useFetch<Language[]>(
  `${runtimeConfig.public.serverUrl}/languages`
);

const { socket } = storeToRefs(useSocket());

// English is selected by default
const preferredLanguageIndex = ref(
  Languages.value?.findIndex((l) => l.code === "EN") || 0
);

watch(
  [preferredLanguageIndex, socket, Languages],
  ([langIdx, socket, allLanguages]) => {
    const lang = allLanguages?.[langIdx]?.code;
    socket?.emit("language:selected", lang);
  },
  { immediate: true }
);
</script>
