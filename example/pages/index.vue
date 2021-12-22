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
    <section>
      <h2>Live feed</h2>
      <ul>
        <li v-for="item in feedItems" :key="item.id">
          <structured-text :data="item.content" />
        </li>
      </ul>
    </section>
  </div>
</template>

<script>
import { StructuredText } from 'vue-datocms';

const pageQuery = `
query {
  page: home {
    title
  }
}
`;

const liveFeedQuery = `
query {
  home {
    feedItems: liveFeed {
      ... on LiveFeedItemRecord {
        id
        content {
          value
        }
      }
    }
  }
}
`;

export default {
  components: {
    StructuredText,
  },
  asyncData ({ $dato }) {
    return $dato.query({ query: pageQuery });
  },
  data () {
    return {
      feedItems: [],
    };
  },
  mounted () {
    this.$dato.subscribe({
      query: pageQuery,
      onUpdate: (data) => {
        this.page = data.page;
      },
    });

    this.$dato.subscribe({
      query: liveFeedQuery,
      enabled: true,
      preview: false,
      onUpdate: (data) => {
        this.feedItems = data.home.feedItems;
      },
    });
  },
};
</script>
