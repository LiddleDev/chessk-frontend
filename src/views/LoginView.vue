<script setup>
import {ref} from "vue";
import InputText from 'primevue/inputtext';
import Button from "primevue/button";
import axios from "axios";
import {useUserStore} from "@/stores/user.js";
import router from "@/router/index.js";

const userStore = useUserStore();

const name = ref(null)

function startPlaying() {
  if (!name.value) {
    return;
  }

  axios.post('https://chessk-backend.liddlelabs.com:8080/login', {
    name: name.value,
  })
      .then(res => {
        userStore.$patch({
          name: res.data.name,
        });

        router.push('/');
      })
}

</script>

<template>
  <div class="login py-8">
    <div class="flex flex-col gap-1">
      <label for="name">Name</label>
      <InputText v-model="name" id="name" placeholder="Enter your name to get started..." required />
    </div>
    <Button label="Start playing" class="mt-4" @click="startPlaying()" />
  </div>
</template>
