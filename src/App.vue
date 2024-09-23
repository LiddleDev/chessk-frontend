<script setup>
import { RouterLink, RouterView } from 'vue-router'
import {useUserStore} from "@/stores/user.js";
import router from "@/router/index.js";
import axios from "axios";

const userStore = useUserStore();

axios.interceptors.request.use(function (config) {
  if (userStore.session) {
    config.headers['User-Session'] = userStore.session;
  }

  return config;
});

axios.interceptors.response.use(function (response) {
  const session = response.headers.get('User-Session');

  if (session) {
    userStore.session = session;
  }

  return response;
});

if (!userStore.name) {
  router.push('/login');
} else {
  axios.get('http://18.132.181.26:8080/user')
      .then(res => {
        userStore.$patch({
          name: res.data.name,
        });
      })
      .catch(err => {
        userStore.$patch({
          name: null,
        });

        router.push('/login');
      })
}
</script>

<template>
  <header>
    <div class="wrapper">
      <RouterLink to="/">
        <h1 class="text-3xl">ChessK</h1>
      </RouterLink>
    </div>
  </header>

  <RouterView />
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}
</style>
