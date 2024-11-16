<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-form @submit.prevent="" @submit="submitForm">
          <v-card-text>
            <v-row class="mb-4">
              <v-col cols="12" class="d-flex justify-center align-center flex-column">
                <v-avatar :color="stringToHslColor(userStore.user.email)" size="100">
                  <v-img
                    alt="profile picture"
                    v-if="userStore.user.avatarUrl"
                    :src="userStore.user.avatarUrl"
                  ></v-img>
                  <v-img
                    alt="profile picture"
                    v-else-if="avatarFileState"
                    :src="createObjectURL(avatarFileState as File)"
                  >
                  </v-img>
                  <span v-else class="text-h5">{{ userStore.user.username.substring(0, 2).toLocaleUpperCase() }}</span>
                </v-avatar>
                <v-btn small color="primary" class="mt-2" @click="selectFile"
                  ><input
                    type="file"
                    accept="image/*"
                    ref="avatarFileInput"
                    @change="handleFileChange"
                    class="d-none"
                  />Change Avatar</v-btn
                >
              </v-col>
            </v-row>
            <v-text-field
              label="Username"
              prepend-icon="mdi-account"
              v-model="username"
              :bind="usernameAttributes"
              :hint="errors.username"
              :error="Boolean(errors.username)"
              persistent-hint
            />
            <v-text-field prepend-icon="mdi-email" label="Email" v-model="userStore.user.email" :disabled="true" />
            <v-text-field
              label="Old Password"
              prepend-icon="mdi-lock"
              type="password"
              v-model="oldPassword"
              :bind="oldPasswordAttributes"
              :hint="errors.oldPassword"
              :error="Boolean(errors.oldPassword)"
              persistent-hint
            />
            <v-text-field
              label="New Password"
              prepend-icon="mdi-lock"
              type="password"
              v-model="newPassword"
              :bind="newPasswordAttributes"
              :hint="errors.newPassword"
              :error="Boolean(errors.newPassword)"
              persistent-hint
            />
          </v-card-text>

          <v-card-actions class="d-flex flex-wrap ga-4">
            <v-btn
              color="primary"
              type="submit"
              :disabled="userStore.user.username === username && (!oldPassword || !newPassword) && !avatarFileState"
              >Update Profile</v-btn
            >
            <v-btn color="error" variant="flat" @click="deleteProfileDialogIsActive = true"> Delete Profile</v-btn>
          </v-card-actions>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
  <v-dialog v-model="deleteProfileDialogIsActive" max-width="400">
      <v-card>
        <v-card-title class="headline">
          Confirm Delete
        </v-card-title>
        
        <v-card-text>
          Are you sure you want to delete your account? This action cannot be undone.
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" @click="deleteProfileDialogIsActive = false">
            Cancel
          </v-btn>
          <v-btn color="error" variant="flat" @click="deleteUser">
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/user.store';
import { stringToHslColor, createObjectURL } from '@/common/utils';
import { useForm } from 'vee-validate';
import { Ref, ref } from 'vue';
import { UpdateProfileValidationSchema } from '@/common/validation-schemas';

const userStore = useUserStore();

const avatarFileInput: Ref<null | HTMLButtonElement> = ref(null);
const avatarFileState = ref<File | null>(null);

const deleteProfileDialogIsActive = ref(false);

const selectFile = (): void => {
  (avatarFileInput.value as HTMLButtonElement).click();
};

const handleFileChange = async (event: Event): Promise<void> => {
  const target = event.target as HTMLInputElement;
  const files = target.files as FileList;
  avatarFileState.value = files[0];
};

const { errors, handleSubmit, defineField } = useForm({
  initialValues: {
    username: userStore.user.username,
    oldPassword: '',
    newPassword: '',
  },
  validationSchema: UpdateProfileValidationSchema
});
const [username, usernameAttributes] = defineField('username');
const [oldPassword, oldPasswordAttributes] = defineField('oldPassword');
const [newPassword, newPasswordAttributes] = defineField('newPassword');

const submitForm = handleSubmit(async (values) => {
  const form = new FormData();
  if (values.username !== userStore.user.username) form.append('username', values.username);
  if (values.oldPassword && values.newPassword) {
    form.append('oldPassword', values.oldPassword);
    form.append('newPassword', values.newPassword);
  }
  if (avatarFileState) form.append('file', avatarFileState.value as File);
  await userStore.updateMe(form);
});

const deleteUser = async() => {
  await userStore.deleteMe();
  deleteProfileDialogIsActive.value = false;
}

</script>
