<template>
  <div class="d-flex align-center justify-center" style="height: 100vh">
    <v-sheet v-if="!createBookForm.file" width="200">
      <v-btn type="file" color="primary" @click="selectFile" block class="mt-2">
        <input
          ref="fileInput"
          class="d-none"
          type="file"
          @change="handleFileChange"
        />
        Upload Book
      </v-btn>
    </v-sheet>
    <v-sheet v-else width="400">
      <v-form fast-fail @submit.prevent="">
        <h1 class="text-center mb-4">Create book</h1>

        <v-text-field v-model="createBookForm.name" label="Book Name"></v-text-field>

        <v-btn color="primary" block class="mt-2">Create Book</v-btn>
      </v-form>
    </v-sheet>
  </div>
</template>

<script setup>
import { ref } from "vue";

const fileInput = ref(null);

const createBookForm = ref({
  file: null,
  name: ""
});

const selectFile = () => {
  fileInput.value.click();
};

const handleFileChange = (event) => {
  createBookForm.value.file = event.target.files[0];
};
</script>
