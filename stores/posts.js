import { find, uniq, get } from 'lodash-es'

export const usePosts = defineStore('posts', () => {
  const { $api } = useNuxtApp()

  const posts = ref([])

  async function fetch () {
    const { data } = await $api.get('posts')
    posts.value = data
  }

  async function create ({ title, body }) {
    const payload = await $api.post('posts', { title, body })
    
    const newPost = payload?.data ?? payload

    posts.value = [newPost, ...posts.value]
    return newPost
  }

  return {
    posts,  
    fetch,
    create
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(usePosts, import.meta.hot))
}
