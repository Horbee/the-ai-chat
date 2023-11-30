<template>
  <v-dialog v-model="isOpen" persistent max-width="550px" width="100%">
    <v-card>
      <v-card-title class="text-h5"> Tell us how we can call you </v-card-title>
      <v-card-text>
        <v-form id="usernameForm" @submit.prevent="handleUsernameSave">
          <v-text-field
            label="Your name"
            v-model="username"
            :rules="[Validations.required('This field is required')]"
          ></v-text-field>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          type="submit"
          color="orange-darken-1"
          variant="text"
          form="usernameForm"
        >
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import type { SubmitEventPromise } from "vuetify";

const props = withDefaults(
  defineProps<{
    isOpen: boolean;
    username?: string;
  }>(),
  { isOpen: false, username: "" }
);

const username = ref(props.username);

const { getSession } = useAuth();

const emit = defineEmits<{ (event: "update:isOpen", value: boolean): void }>();

const isOpen = useVModel(props, "isOpen", emit);

const handleUsernameSave = async (event: SubmitEventPromise) => {
  const result = await event;
  if (!result.valid) return;

  try {
    await $fetch("/api/username", {
      method: "POST",
      body: { username: username.value },
    });
    isOpen.value = false;
    await getSession({ required: true }); // refresh route to get new session user data
  } catch (error) {
    console.error("Save username error.", error);
  }
};
</script>
