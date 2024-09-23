<script setup>
import axios from "axios";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import {ref} from "vue";
import router from "@/router/index.js";

const createMatchForm = ref({
  time: 600,
  increment: null,
})

const matches = ref([])

axios.get('https://chessk-backend.liddlelabs.com:8080/matches')
    .then(res => {
      matches.value = res.data;
    })

function createMatch() {
  axios.post('https://chessk-backend.liddlelabs.com:8080/matches', {
      time: createMatchForm.value.time,
      increment: createMatchForm.value.increment,
    })
    .then(res => {
      router.push('/matches/'+res.data)
    })
}
</script>

<template>
  <main>
    <div class="create-match py-8">
      <div class="flex flex-col gap-1">
        <label for="time">Time</label>
        <InputText v-model="createMatchForm.time" id="time" placeholder="Seconds" />
      </div>
      <div class="flex flex-col gap-1 mt-2">
        <label for="increment">Increment</label>
        <InputText v-model="createMatchForm.increment" id="increment" placeholder="Seconds" />
      </div>
      <Button label="Create Match" class="mt-4" @click="createMatch()" />
    </div>

    <div>

      <div class="overflow-x-auto">
        <table class="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
          <thead class="text-left">
          <tr>
            <th class="whitespace-nowrap px-4 py-2 font-medium text-gray-900">White</th>
            <th class="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Black</th>
            <th class="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Time</th>
            <th class="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Increment</th>
            <th class="whitespace-nowrap px-4 py-2 font-medium text-gray-900" width="1"></th>
          </tr>
          </thead>

          <tbody class="divide-y divide-gray-200">
          <tr v-for="match in matches">
            <td class="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
              {{ match.white ?? '-' }}
            </td>
            <td class="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
              {{ match.black ?? '-' }}
            </td>
            <td class="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
              <span v-if="match.time">
                {{ Math.floor(match.time / 60).toString().padStart(2, '0') }}:{{ (match.time % 60).toString().padStart(2, '0') }}
              </span>
              <span v-else>
                Unlimited
              </span>
            </td>
            <td class="whitespace-nowrap px-4 py-2 text-gray-700">
              {{ match.increment ? match.increment + ' seconds' : '' }}
            </td>
            <td class="whitespace-nowrap px-4 py-2 text-gray-700">
              <RouterLink :to="'/matches/' + match.code">
                <Button label="Join"></Button>
              </RouterLink>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </main>
</template>
