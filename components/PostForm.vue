<script setup>
import { ref } from "vue";

const title = ref("");
const body = ref("");
const image = ref(null);

const posts = usePosts();

function onFileChange(e) {
  const f = e.target.files && e.target.files[0];
  image.value = f || null;
}

async function submit() {
  if (!title.value && !body.value && !image.value) return;

  try {
    if (image.value) {
      const form = new FormData();
      form.append("title", title.value);
      form.append("body", body.value);
      form.append("image", image.value);
      await posts.create(form);
    } else {
      await posts.create({ title: title.value, body: body.value });
    }

    title.value = "";
    body.value = "";
    image.value = null;
    const input = document.getElementById("post-image-input");
    if (input) input.value = null;
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
    <div>
      <label class="block text-sm font-medium mb-1">Image (optional)</label>
      <input
        id="post-image-input"
        type="file"
        accept="image/*"
        @change="onFileChange"
        class="block"
      />
    </div>
    <button class="bg-blue-600 text-white px-8 py-4 rounded-lg">Post</button>
  </form>
</template>
