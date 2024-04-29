<template>
  <div class="d-flex align-center justify-center h-screen w-100">
    <v-sheet v-if="!fileState" width="200">
      <v-btn type="file" color="primary" @click="selectFile" block class="mt-2">
        <input ref="fileInput" class="d-none" type="file" @change="handleFileChange" />
        Upload Book
      </v-btn>
    </v-sheet>
    <v-sheet v-else width="400">
      <v-form
        v-if="uploadBookStore.dataStatus === DataStatus.FULFILLED || uploadBookStore.dataStatus === DataStatus.IDLE"
        fast-fail
        @submit.prevent=""
        @submit="submitForm"
      >
        <h1 class="text-center mb-4">Create book</h1>

        <v-text-field
          v-model="name"
          :bind="nameAttrs"
          :hint="errors.name"
          :error="Boolean(errors.name)"
          persistent-hint
          label="Book Name"
        ></v-text-field>
        <v-switch
          v-bind:label="isPrivate ? 'Private' : 'Public'"
          color="info"
          v-model="isPrivate"
          :bind="isPrivateAttrs"
          :hint="errors.isPrivate"
          :error="Boolean(errors.isPrivate)"
          persistent-hint
        ></v-switch>

        <v-btn color="primary" type="submit" block class="mt-2">Create Book</v-btn>
      </v-form>
      <v-sheet v-else class="d-flex w-100 align-center justify-center">
        <v-progress-circular color="primary" indeterminate model-value="20" :size="82"></v-progress-circular>
      </v-sheet>
    </v-sheet>
  </div>
</template>

<script setup lang="ts">
import { AppRoute } from '@/common/enums';
import { useUploadBookStore } from '@/stores/upload-book.store';
import { DataStatus } from '@/common/enums';
import { Ref, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useForm } from 'vee-validate';
import { UploadBookValidationSchema } from '@/common/validation-schemas';

const router = useRouter();

const fileInput: Ref<null | HTMLButtonElement> = ref(null);

const uploadBookStore = useUploadBookStore();

const { errors, defineField, handleSubmit } = useForm({
  initialValues: {
    isPrivate: false,
    name: '',
  },
  validationSchema: UploadBookValidationSchema,
});

const [isPrivate, isPrivateAttrs] = defineField('isPrivate');
const [name, nameAttrs] = defineField('name');

const fileState = ref<File | null>(null);

const selectFile = () => {
  (fileInput.value as HTMLButtonElement).click();
};

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const files = target.files as FileList;
  fileState.value = files[0];
};

const submitForm = handleSubmit(async (values) => {
  const form = new FormData();
  form.append('name', values.name);
  form.append('isPrivate', String(values.isPrivate));
  form.append('file', fileState.value as File);

  await uploadBookStore.create(form);
  router.push(AppRoute.BOOKS);
});
</script>
