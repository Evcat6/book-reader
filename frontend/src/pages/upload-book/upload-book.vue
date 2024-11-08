<template>
  <div class="d-flex align-center justify-center h-screen w-100">
    <v-sheet v-if="!fileState" width="200">
      <v-btn type="file" color="primary" block class="mt-2" @click="selectFile">
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
          :bind="nameAttributes"
          :hint="errors.name"
          :error="Boolean(errors.name)"
          persistent-hint
          label="Book Name"
        />
        <v-select
          label="Genre"
          :items="genresStore.genres"
          :bind="genresIdsAttributes"
          v-model="genresIds"
          multiple
          persistent-hint
          item-title="name"
          item-value="id"
        >
        </v-select>
        <v-switch
          v-model="isPrivate"
          :label="isPrivate ? 'Private' : 'Public'"
          color="info"
          :bind="isPrivateAttributes"
          :hint="errors.isPrivate"
          :error="Boolean(errors.isPrivate)"
          persistent-hint
        />

        <v-btn color="primary" type="submit" block class="mt-2"> Create Book </v-btn>
      </v-form>
      <v-sheet v-else class="d-flex w-100 align-center justify-center">
        <v-progress-circular color="primary" indeterminate model-value="20" :size="82" />
      </v-sheet>
    </v-sheet>
  </div>
</template>

<script setup lang="ts">
import { useForm } from 'vee-validate';
import type { Ref } from 'vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

import { AppRoute, DataStatus } from '@/common/enums';
import { UploadBookValidationSchema } from '@/common/validation-schemas';
import { useUploadBookStore } from '@/stores/upload-book.store';
import { useGenresStore } from '@/stores/genres.store';

const router = useRouter();

const fileInput: Ref<null | HTMLButtonElement> = ref(null);

const genresStore = useGenresStore();
const uploadBookStore = useUploadBookStore();

if(genresStore.dataStatus === DataStatus.IDLE) genresStore.loadAll();

const { errors, defineField, handleSubmit } = useForm<{
  isPrivate: boolean;
  name: string;
  genresIds: string[];
}>({
  initialValues: {
    isPrivate: false,
    name: '',
    genresIds: [],
  },
  validationSchema: UploadBookValidationSchema,
});

const [isPrivate, isPrivateAttributes] = defineField('isPrivate');
const [name, nameAttributes] = defineField('name');
const [genresIds, genresIdsAttributes] = defineField('genresIds');

const fileState = ref<File | null>(null);

const selectFile = (): void => {
  (fileInput.value as HTMLButtonElement).click();
};

const handleFileChange = (event: Event): void => {
  const target = event.target as HTMLInputElement;
  const files = target.files as FileList;
  fileState.value = files[0];
};

const submitForm = handleSubmit(async (values) => {
  const form = new FormData();
  form.append('name', values.name);
  form.append('isPrivate', String(values.isPrivate));
  form.append('file', fileState.value as File);
  form.append('genresIds', JSON.stringify(values.genresIds));

  await uploadBookStore.createOne(form);
  void router.push(AppRoute.BOOKS);
});
</script>
