<template>
  <v-sheet
    width="400"
    class="mx-auto"
  >
    <v-form
      fast-fail
      @submit.prevent="onSubmit"
    >
      <v-text-field
        v-model="email"
        type="email"
        label="Email"
        :bind="emailAttrs"
        :hint="errors.email"
        :error="Boolean(errors.email)"
        persistent-hint
      />

      <v-text-field
        v-model="password"
        type="password"
        :hint="errors.password"
        :error="Boolean(errors.password)"
        :bind="passwordAttrs"
        label="password"
        persistent-hint
      />

      <v-btn
        color="primary"
        block
        type="submit"
        class="mt-2"
      >
        Login
      </v-btn>
    </v-form>
    <div class="mt-2">
      <p class="text-body-2">
        Don't have an account?
        <RouterLink :to="AppRoute.REGISTER">
          Register
        </RouterLink>
      </p>
    </div>
  </v-sheet>
</template>

<script setup lang="ts">
import { AppRoute } from '@/common/enums';
import { useAuthStore } from '@/stores/auth.store';
import { useRouter } from 'vue-router';
import { useForm } from 'vee-validate';
import { LoginValidationSchema } from '@/common/validation-schemas';

const { errors, handleSubmit, defineField } = useForm({
  initialValues: {
    email: '',
    password: '',
  },
  validationSchema: LoginValidationSchema,
});

const [email, emailAttrs] = defineField('email');
const [password, passwordAttrs] = defineField('password');

const authStore = useAuthStore();

const router = useRouter();

const onSubmit = handleSubmit(async (values) => {
  await authStore.login(values);
  router.push(AppRoute.UPLOAD_BOOK);
});
</script>
