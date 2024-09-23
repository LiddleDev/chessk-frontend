import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  const name = ref(null)
  const session = ref(null)

  return { name, session }
}, {
  persist: true,
})
