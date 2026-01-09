<script setup>
import { onMounted, onUnmounted } from 'vue'

definePageMeta({
  middleware: ["validate-session"],
});

const user = useUser();
const postsStore = usePosts();

let pollInterval = null;

await postsStore.fetch();

function startPolling () {
  // Check for new posts every 30 seconds
  pollInterval = setInterval(() => {
    postsStore.checkForNewPosts()
  }, 30000)
}

function stopPolling () {
  if (pollInterval) {
    clearInterval(pollInterval)
    pollInterval = null
  }
}

onMounted(() => {
  startPolling()
})

onUnmounted(() => {
  stopPolling()
})

async function handleLoadNewPosts () {
  await postsStore.loadNewPosts()
}
</script>

<template>
  <PostForm v-if="!user.isGuest" />
  
  <div v-if="postsStore.newPostsCount > 0" class="mb-6">
    <button
      @click="handleLoadNewPosts"
      class="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
    >
      Load New Posts ({{ postsStore.newPostsCount }})
    </button>
  </div>
  
  <div class="grid gap-16">
    <PostItem
      v-for="post in postsStore.posts"
      :key="post.id"
      v-bind="{ post }"
    />
  </div>
</template>
