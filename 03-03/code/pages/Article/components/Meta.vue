<template>
  <div class="article-meta">
    <nuxt-link
      :to="{
        name: 'Profile',
        query: {
          username: article.author.username,
        },
      }"
      ><img :src="article.author.image" />
      <div class="info">
        {{ article.author.username }}
        <span class="date">{{ article.createdAt | format }}</span>
      </div>
    </nuxt-link>
    <button class="btn btn-sm btn-outline-secondary">
      <i class="ion-plus-round"></i>
      &nbsp; Follow {{ article.author.username }}
      <span class="counter">({{ article.author.followingCount || 0 }})</span>
    </button>
    &nbsp;&nbsp;
    <button class="btn btn-sm btn-outline-primary">
      <i class="ion-heart"></i>
      &nbsp; Favorite Post
      <span class="counter">({{ article.favoritesCount }})</span>
    </button>
  </div>
</template>

<script>
export default {
  name: "ArticleMeta",
  props: {
    article: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style></style>
