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

const isOwnPost = computed(() => {
  if (user.isGuest) return false;
  return String(user.data.id) === String(props.post.user.id);
});

const isFavorited = computed(() => {
  if (user.isGuest) return false;
  return favoriteStore.isFavorite(props.post.user.id);
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
    <button
      class="bg-red-200 text-red-500 flex items-center justify-center gap-2 p-4 rounded-lg"
    >
      <HeartIcon class="h-6 stroke-current" />
      <span class="font-bold"> Add to my favorites </span>
    </button>
  </div>
</template>
