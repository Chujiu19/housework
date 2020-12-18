<template>
  <div class="row">
    <div class="col-xs-12 col-md-8 offset-md-2">
      <form action="javascript:void(0);" class="card comment-form">
        <div class="card-block">
          <textarea
            v-model="comment"
            class="form-control"
            placeholder="Write a comment..."
            rows="3"
          ></textarea>
        </div>
        <div class="card-footer">
          <img :src="user.image" class="comment-author-img" />
          <button
            class="btn btn-sm btn-primary"
            :disabled="!comment"
            @click="addComment"
          >
            Post Comment
          </button>
        </div>
      </form>

      <div v-for="(comment, i) in comments" :key="i" class="card">
        <div class="card-block">
          <p class="card-text">{{ comment.body }}</p>
        </div>
        <div class="card-footer">
          <nuxt-link
            class="comment-author"
            :to="{
              name: 'Profile',
              query: {
                username: comment.author.username,
              },
            }"
          >
            <img :src="comment.author.image" class="comment-author-img"
          /></nuxt-link>
          &nbsp;
          <a href="" class="comment-author">{{ comment.author.username }}</a>
          <span class="date-posted">{{ comment.createdAt | format }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getComments, addComment, deleteComment } from "@/service/article";
export default {
  name: "ArticleComments",
  props: {
    article: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      comments: [],
      comment: null,
    };
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
  },
  async mounted() {
    try {
      const res = await getComments(this.article.slug);
      let comments = res.data.comments;
      this.comments = comments;
    } catch (err) {
      console.log(err, "err");
    }
  },
  methods: {
    async addComment() {
      try {
        let data = await addComment(this.article.slug, {
          comment: { body: this.comment },
        });
        this.comments.push(data.data);
      } catch (err) {}
    },
  },
};
</script>

<style></style>
