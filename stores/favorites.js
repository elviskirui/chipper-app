import { get } from 'lodash-es'
import { watch } from 'vue'

export const useFavorites = defineStore('favorites', () => {
  const { $api } = useNuxtApp()

  const favorites = ref([]) // users array
  const posts = ref([]) // favorite posts

  function setUsers (list = []) {
    favorites.value = list || []
  }

  function setPosts (list = []) {
    posts.value = list || []
  }

  function isFavorite (userId) {
    return !!favorites.value.find(f => String(get(f, 'id')) === String(userId))
  }

  function isPostFavorite (postId) {
    return !!posts.value.find(p => String(get(p, 'id')) === String(postId))
  }

  async function follow (userId) {
    await $api.post(`/users/${userId}/favorite`)
    if (!isFavorite(userId)) favorites.value.unshift({ id: userId })
  }

  async function unFollow (userId) {
    await $api.delete(`/users/${userId}/favorite`)
    favorites.value = favorites.value.filter(f => String(get(f, 'id')) !== String(userId))
  }

  async function favoritePost (postId) {
    await $api.post(`/posts/${postId}/favorite`)
    if (!isPostFavorite(postId)) posts.value.unshift({ id: postId })
  }

  async function unfavoritePost (postId) {
    await $api.delete(`/posts/${postId}/favorite`)
    posts.value = posts.value.filter(p => String(get(p, 'id')) !== String(postId))
  }

  async function fetch () {
    const payload = await $api.get('favorites')
    const raw = payload?.data ?? payload
    const remotePosts = raw?.posts ?? []
    const remoteUsers = raw?.users ?? raw?.favorites ?? []
    setPosts(remotePosts)
    setUsers(remoteUsers)
    return { posts: remotePosts, users: remoteUsers }
  }

  try {
    const user = useUser()
    const userFavs = get(user, 'data.favorites', null)
    if (userFavs) {
      setUsers(userFavs)
    } else if (!user.isGuest) {
      fetch().catch(() => {})
    }

    watch(() => user.data, (val) => {
      const list = get(val, 'favorites', null)
      if (list) setUsers(list)
      else if (!user.isGuest) fetch().catch(() => setUsers([]))
      else setUsers([])
    }, { immediate: false })
  } catch (e) {
    
  }

  return {
    favorites,
    posts,
    set: setUsers,
    setUsers,
    setPosts,
    isFavorite,
    isPostFavorite,
    follow,
    unFollow,
    favoritePost,
    unfavoritePost,
    fetch
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useFavorites, import.meta.hot))
}
