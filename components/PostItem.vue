<script setup>
import { HeartIcon } from "@heroicons/vue/24/outline";
import { computed, ref } from "vue";

const props = defineProps({
  post: {
    type: Object,
    required: true,
  },
});

const user = useUser();
const favoriteStore = useFavorites();
const isProcessing = ref(false);
const isPostProcessing = ref(false);

const isOwnPost = computed(() => {
  if (user.isGuest) return false;
  return String(user.data.id) === String(props.post.user.id);
});

const isFavorited = computed(() => {
  if (user.isGuest) return false;
  return favoriteStore.isFavorite(props.post.user.id);
});

const isPostFavorited = computed(() => {
  if (user.isGuest) return false;
  return favoriteStore.isPostFavorite(props.post.id);
});

async function toggleFavorite() {
  if (user.isGuest) return;
  const userId = props.post.user.id;
  isProcessing.value = true;
  try {
    if (favoriteStore.isFavorite(userId)) {
      await favoriteStore.unFollow(userId);
    } else {
      await favoriteStore.follow(userId);
    }
  } finally {
    isProcessing.value = false;
  }
}

async function togglePostFavorite() {
  if (user.isGuest) return;
  const postId = props.post.id;
  isPostProcessing.value = true;
  try {
    if (favoriteStore.isPostFavorite(postId)) {
      await favoriteStore.unfavoritePost(postId);
    } else {
      await favoriteStore.favoritePost(postId);
    }
  } finally {
    isPostProcessing.value = false;
  }
}
</script>

<template>
  <div class="grid gap-3">
    <h4 class="font-bold text-lg">
      {{ post.title }}
    </h4>
    <div class="flex justify-between bg-gray-100 p-4 rounded-lg">
      <div>
        by <strong>{{ post.user.name }}</strong>
      </div>
      <button
        v-if="!user.isGuest && !isOwnPost"
        @click.prevent="toggleFavorite"
        :disabled="isProcessing"
        class="font-medium bg-blue-200 text-sm px-2 rounded-full disabled:opacity-50"
      >
        {{ isFavorited ? "Unfollow" : "Follow" }}
      </button>
    </div>
    <p>
      {{ post.body }}
    </p>
    <div v-if="post.image || post.image_url" class="mt-3">
      <img
        :src="post.image_url || post.image"
        alt="post image"
        class="w-full rounded-lg object-cover max-h-96"
      />
    </div>
    <button
      v-if="!user.isGuest"
      @click.prevent="togglePostFavorite"
      :disabled="isPostProcessing"
      :class="[
        'flex items-center justify-center gap-2 p-4 rounded-lg font-bold transition-colors disabled:opacity-50',
        isPostFavorited ? 'bg-red-500 text-white' : 'bg-red-200 text-red-500',
      ]"
    >
      <HeartIcon class="h-6 stroke-current" />
      <span>{{
        isPostFavorited ? "Remove from favorites" : "Add to my favorites"
      }}</span>
    </button>
  </div>
</template>
