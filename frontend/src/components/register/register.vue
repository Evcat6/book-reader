<template>
  <v-sheet
    width="400"
    class="mx-auto"
  >
    <v-form
      fast-fail
      @submit.prevent=""
      @submit="onSubmit"
    >
      <v-text-field
        v-model="username"
        label="User Name"
        :bind="usernameAttributes"
        :hint="errors.username"
        :error="Boolean(errors.username)"
        persistent-hint
      />

      <v-text-field
        v-model="email"
        type="email"
        label="Email"
        :bind="emailAttributes"
        :hint="errors.email"
        :error="Boolean(errors.email)"
        persistent-hint
      />

      <v-text-field
        v-model="password"
        type="password"
        label="Password"
        :bind="passwordAttributes"
        :hint="errors.password"
        :error="Boolean(errors.password)"
        persistent-hint
      />

      <v-text-field
        v-model="repeatPassword"
        type="password"
        label="Repeat password"
        :bind="repeatPasswordAttributes"
        :hint="errors.repeatPassword"
        :error="Boolean(errors.repeatPassword)"
        persistent-hint
      />

      <v-btn
        type="submit"
        color="primary"
        block
        class="mt-2"
      >
        Register
      </v-btn>
    </v-form>
    <div class="mt-2">
      <p class="text-body-2">
        Already have an account?
        <RouterLink :to="AppRoute.LOGIN">
          Login
        </RouterLink>
      </p>
    </div>
  </v-sheet>
</template>

<script setup lang="ts">
import { useForm } from 'vee-validate';
import { useRouter } from 'vue-router';

import { AppRoute } from '@/common/enums';
import { RegisterValidationSchema } from '@/common/validation-schemas';
import { useAuthStore } from '@/stores/auth.store';

const { errors, handleSubmit, defineField } = useForm({
  initialValues: {
    username: '',
    email: '',
    password: '',
    repeatPassword: '',
  },
  validationSchema: RegisterValidationSchema,
});

const [username, usernameAttributes] = defineField('username');
const [email, emailAttributes] = defineField('email');
const [password, passwordAttributes] = defineField('password');
const [repeatPassword, repeatPasswordAttributes] = defineField('repeatPassword');

const authStore = useAuthStore();

const router = useRouter();

const onSubmit = handleSubmit(async (values) => {
  const { repeatPassword, ...formData } = values;
  await authStore.register(formData);
  void router.push(AppRoute.UPLOAD_BOOK);
});
</script>
