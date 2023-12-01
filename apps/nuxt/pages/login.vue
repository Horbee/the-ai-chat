<template>
  <v-container>
    <v-sheet
      max-width="500px"
      class="text-center mx-auto px-4 py-4 mt-6"
      elevation="2"
    >
      <!-- E-Mail successfully sent for log in -->
      <div v-if="formState.success">
        <h2 class="text-h4 font-weight-black text-orange">Success!</h2>

        <p class="text-body-2 mb-4">
          Please head over to your inbox/spam or others folder to find our login
          email.
        </p>

        <v-btn variant="text" color="orange" @click="resetFormState"
          >Go back to Login</v-btn
        >
      </div>

      <!-- Login form -->
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

      <!-- Error alert -->
      <v-alert
        v-if="formState.authError"
        class="mt-3"
        text="An unexpected error occured during authentication. Please try again later."
        type="error"
      ></v-alert>
    </v-sheet>
  </v-container>
</template>

<script setup lang="ts">
import type { SubmitEventPromise } from "vuetify";

definePageMeta({
  middleware: ["redirect-authenticated"],
});
useHead({ title: "The AI Chat: Login" });

const { signIn } = useAuth();

const formState = reactive({
  email: "",
  success: false,
  authError: false,
});

const resetFormState = () => {
  formState.email = "";
  formState.success = false;
  formState.authError = false;
};

const handleSubmit = async (event: SubmitEventPromise) => {
  formState.authError = false;
  const results = await event;

  if (!results.valid) return;

  try {
    await signIn("email", { email: formState.email, redirect: false });
    formState.success = true;
    formState.email = "";
  } catch (error) {
    console.error("Auth error:", error);
    formState.authError = true;
  }
};
</script>
