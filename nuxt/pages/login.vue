<template>
  <v-container>
    <v-sheet
      max-width="500px"
      class="text-center mx-auto px-4 py-4 mt-6"
      elevation="2"
    >
      <div v-if="formState.success">
        <h2 class="text-h4 font-weight-black text-orange">Success!</h2>

        <p class="text-body-2 mb-4">
          Please head over to your inbox/spam or others folder to find our login
          email.
        </p>

        <v-btn variant="text" color="orange" @click="formState.success = false"
          >Go back to Login</v-btn
        >
      </div>

      <v-form v-else @submit.prevent="handleSubmit" validate-on="blur">
        <h2 class="mb-4 text-h4 text-orange">Login to the AI Chat</h2>
        <v-text-field
          v-model="formState.email"
          :rules="[
            Validations.required('E-Mail is required'),
            Validations.validEmail('You must enter a valid E-Mail address'),
          ]"
          label="Your E-Mail:"
          class="mb-2"
        ></v-text-field>

        <v-btn type="submit" color="orange">Login</v-btn>
      </v-form>
    </v-sheet>
  </v-container>
</template>

<script setup lang="ts">
import { Validations } from "@/utils/validation";
import type { SubmitEventPromise } from "vuetify";

definePageMeta({
  middleware: ["redirect-authenticated"],
});
useHead({ title: "The AI Chat: Login" });

const { signIn } = useAuth();

const formState = reactive({
  email: "",
  success: false,
});

const handleSubmit = async (event: SubmitEventPromise) => {
  const results = await event;

  if (!results.valid) return;

  try {
    await signIn("email", { email: formState.email, redirect: false });
    formState.success = true;
    formState.email = "";
  } catch (error) {
    console.error("Auth error:", error);
  }
};
</script>
