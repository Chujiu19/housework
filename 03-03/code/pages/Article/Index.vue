<template>
  <div class="article-page">
    <div class="banner">
      <div class="container">
        <h1>{{ article.title }}</h1>
        <article-meta :article="article" />
      </div>
    </div>

    <div class="container page">
      <div class="row article-content">
        <div class="col-md-12" v-html="article.body" />
      </div>
      <hr />

      <div class="article-actions">
        <article-meta :article="article" />
      </div>
      <article-comments :article="article" />
    </div>
  </div>
</template>

<script>
import { getArticle } from "@/service/article";
import ArticleMeta from "./components/Meta";
import ArticleComments from "./components/Comments";
import MarkdownIt from "markdown-it";
export default {
  name: "ArticlePage",
  components: {
    ArticleMeta,
    ArticleComments,
  },
  async asyncData(context) {
    try {
      const data = await getArticle(context.params.slug);
      let article = data.data.article;
      const md = new MarkdownIt();
      article.body = md.render(article.body);
      return { article };
    } catch (err) {
      console.log(err);
    }
  },
};
</script>

<style></style>
