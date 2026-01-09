<script setup>
import { ref } from "vue";

const title = ref("");
const body = ref("");

const posts = usePosts();

async function submit() {
  if (!title.value && !body.value) return;

  try {
    await posts.create({ title: title.value, body: body.value });
    title.value = "";
    body.value = "";
  } catch (e) {
    console.error("Failed to create post", e);
  }
}
</script>

<template>
  <form class="grid gap-4 mb-16" @submit.prevent="submit">
    <input
      v-model="title"
      placeholder="Post title"
      class="block w-full rounded-lg border border-gray-400 px-5 py-4 text-sm focus:border-blue-500 focus:outline-none md:text-base"
    />
    <textarea
      v-model="body"
      placeholder="What is happening?!"
      class="block w-full rounded-lg border border-gray-400 px-5 py-4 text-sm focus:border-blue-500 focus:outline-none md:text-base"
    ></textarea>
    <button class="bg-blue-600 text-white px-8 py-4 rounded-lg">Post</button>
  </form>
</template>
