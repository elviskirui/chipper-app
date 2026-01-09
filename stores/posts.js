import { find, uniq, get } from 'lodash-es'

export const usePosts = defineStore('posts', () => {
  const { $api } = useNuxtApp()

  const posts = ref([])
  const newPostsCount = ref(0)

  async function fetch () {
    const { data } = await $api.get('posts')
    posts.value = data
    newPostsCount.value = 0
  }

  async function checkForNewPosts () {
    if (posts.value.length === 0) {
      newPostsCount.value = 0
      return
    }
    try {
      const { data } = await $api.get('posts')
      const fetched = data ?? []
      const existingIds = new Set(posts.value.map(p => p.id))
      const newOnly = fetched.filter(p => !existingIds.has(p.id))
      newPostsCount.value = newOnly.length
    } catch (e) {
      newPostsCount.value = 0
    }
  }

  async function loadNewPosts () {
    if (posts.value.length === 0) return
    try {     
      const { data } = await $api.get('posts')
      const fetched = data ?? []
      const existingIds = new Set(posts.value.map(p => p.id))
      const newOnly = fetched.filter(p => !existingIds.has(p.id))
      if (newOnly.length > 0) {
        posts.value = [...newOnly, ...posts.value]
        newPostsCount.value = 0
      }
    } catch (e) {
      console.error('Failed to load new posts', e)
    }
  }

  async function create ({ title, body }) {
    const payload = await $api.post('posts', { title, body })
    
    const newPost = payload?.data ?? payload

    posts.value = [newPost, ...posts.value]
    return newPost
  }

  return {
    posts,
    newPostsCount,
    fetch,
    checkForNewPosts,
    loadNewPosts,
    create
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(usePosts, import.meta.hot))
}
