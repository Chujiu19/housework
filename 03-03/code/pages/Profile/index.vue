<template>
  <div class="profile-page">
    <div class="user-info">
      <div class="container">
        <div class="row">
          <div class="col-xs-12 col-md-10 offset-md-1">
            <img :src="profile.image" class="user-img" />
            <h4>{{ profile.username }}</h4>
            <p>{{ profile.bio }}</p>
            <button class="btn btn-sm btn-outline-secondary action-btn">
              <i class="ion-plus-round"></i>
              &nbsp; Follow {{ profile.username }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="container">
      <div class="row">
        <div class="col-xs-12 col-md-10 offset-md-1">
          <div class="articles-toggle">
            <ul class="nav nav-pills outline-active">
              <li class="nav-item">
                <nuxt-link
                  exact
                  :class="['nav-link', tab == 'personal' && 'active']"
                  :to="{
                    name: 'Profile',
                    query: {
                      username: profile.username,
                      tab: 'personal',
                    },
                  }"
                  >My Articles</nuxt-link
                >
              </li>
              <li class="nav-item">
                <nuxt-link
                  exact
                  :class="['nav-link', tab == 'favorited' && 'active']"
                  :to="{
                    name: 'Profile',
                    query: {
                      username: profile.username,
                      tab: 'favorited',
                    },
                  }"
                  >Favorited Articles</nuxt-link
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
      </div>
    </div>
  </div>
</template>

<script>
import { getProfile } from "@/service/user";
import { getList } from "@/service/article";
export default {
  name: "Profile",
  async asyncData(context) {
    const query = context.query;
    const { username, tab = "personal" } = query;
    try {
      const res = await getProfile(username);
      let profile = res.data.profile;
      const res2 = await getList({
        [tab == "personal" ? "author" : "favorited"]: username,
      });
      let { articles, articlesCount } = res2.data;

      return {
        profile,
        articles,
        articlesCount,
        tab,
      };
    } catch (err) {}
  },
  watchQuery: ['tab']
};
</script>

<style></style>
