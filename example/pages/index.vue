<template>
  <div>
    <h1>{{ page.title }}</h1>
    <client-only v-if="$previewMode">
      <button v-if="$nuxt.isPreview" @click="$previewMode.exit">
        Exit preview mode (for subscriptions)
      </button>
      <button v-else @click="$previewMode.enter">
        Enter preview mode (for subscriptions)
      </button>
    </client-only>
  </div>
</template>

<script>
const query = `
query {
  page: home {
    title
  }
}
`;

export default {
  asyncData ({ $dato }) {
    return $dato.query({ query });
  },
  mounted () {
    this.$dato.subscribe({
      query,
      onUpdate: (data) => {
        this.page = data.page;
      },
    });
  },
};
</script>
