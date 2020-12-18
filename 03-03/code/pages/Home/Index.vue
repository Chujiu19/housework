<template>
  <div class="home-page">
    <div class="banner">
      <div class="container">
        <h1 class="logo-font">conduit</h1>
        <p>A place to share your knowledge.</p>
      </div>
    </div>

    <div class="container page">
      <div class="row">
        <div class="col-md-9">
          <div class="feed-toggle">
            <ul class="nav nav-pills outline-active">
              <li class="nav-item">
                <nuxt-link
                  v-if="user"
                  :to="getQuery({ page: 1, tab: 'personal', tag: '' })"
                  :class="['nav-link', tab == 'personal' && 'active']"
                  exact
                  >Your Feed</nuxt-link
                >
              </li>
              <li class="nav-item">
                <nuxt-link
                  :to="getQuery({ page: 1, tab: 'global', tag: '' })"
                  :class="['nav-link', tab == 'global' && 'active']"
                  exact
                  >Global Feed</nuxt-link
                >
              </li>
              <li v-if="tag && tag.trim()" class="nav-item">
                <nuxt-link
                  :to="getQuery({ page: 1, tab: 'tag' })"
                  :class="['nav-link', tab == 'tag' && 'active']"
                  exact
                  >#{{ tag }}</nuxt-link
                >
              </li>
            </ul>
          </div>

          <div v-for="(art, i) in articles" :key="i" class="article-preview">
            <div class="article-meta">
              <nuxt-link
                :to="{
                  name: 'Profile',
                  query: {
                    username: art.username,
                  },
                }"
              >
                <img :src="art.author.image" />
                <div class="info">
                  <a href="javascript:void();" class="author">{{
                    art.author.username
                  }}</a>
                  <span class="date">{{ art.createdAt | format }}</span>
                </div>
              </nuxt-link>
              <button
                class="btn btn-outline-primary btn-sm pull-xs-right"
                :class="{ active: art.favorited }"
                @click="() => favorited(art)"
              >
                <i class="ion-heart"></i> {{ art.favoritesCount }}
              </button>
            </div>
            <a href="" class="preview-link">
              <h1>{{ art.title }}</h1>
              <p>{{ art.description }}</p>
              <nuxt-link :to="{ name: 'Article', params: { slug: art.slug } }">
                Read more...
              </nuxt-link>
            </a>
          </div>
        </div>

        <div class="col-md-3">
          <div class="sidebar">
            <p>Popular Tags</p>

            <div class="tag-list">
              <nuxt-link
                v-for="(ta, i) in tags"
                :key="i"
                class="tag-pill tag-default"
                :to="getQuery({ tag: ta, page: 1, tab: 'tag' })"
                >{{ ta }}</nuxt-link
              >
            </div>
          </div>
        </div>

        <ul class="pagination">
          <li
            v-for="n in pageCount"
            :key="n"
            class="page-item"
            :class="{ active: page == n }"
          >
            <nuxt-link :to="getQuery({ page: n })" class="page-link">{{
              n
            }}</nuxt-link>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getList,
  getTags,
  favorite,
  unfavorite,
  feedArticles,
} from "@/service/article";
export default {
  name: "HomePage",
  scrollToTop: true,
  async asyncData(context) {
    try {
      const limit = 20;
      let { tag = "", page = 1, tab = "global" } = context.query;
      let user = context.store.state.user;
      let fn = getList;
      if (tab == "personal" && user && user.token) {
        fn = feedArticles;
      }
      const [tagData, data] = await Promise.all([
        getTags(),
        fn({
          tag,
          limit,
          offset: (page - 1) * limit,
        }),
      ]);
      const tags = tagData.data.tags;
      let { articles, articlesCount } = data.data;
      return {
        tag,
        limit,
        page,
        articlesCount,
        articles,
        tags,
        tab: tab,
      };
    } catch (err) {
      console.log(err, "err");
      return {};
    }
  },
  watchQuery: ["page", "tag", "tab"],
  computed: {
    pageCount() {
      return Math.ceil(this.articlesCount / this.limit);
    },
    user() {
      return !!this.$store.state.user;
    },
  },
  methods: {
    getQuery(obj) {
      let { tag, page, tab } = this;
      return {
        name: "Home",
        query: Object.assign({ tag, page, tab }, obj),
      };
    },
    async favorited(obj) {
      if (obj.requested) return;
      obj.requested = true;
      try {
        if (obj.favorited) {
          await unfavorite(obj.slug);
          obj.favorited = false;
          obj.favoritesCount--;
        } else {
          await favorite(obj.slug);
          obj.favorited = true;
          obj.favoritesCount++;
        }
      } catch (err) {
        console.log(err);
      }
      obj.requested = false;
    },
  },
};
</script>

<style></style>
