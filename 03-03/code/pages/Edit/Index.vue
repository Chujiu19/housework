<template>
  <div class="editor-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-10 offset-md-1 col-xs-12">
          <form action="javascript:void(0);">
            <fieldset>
              <fieldset class="form-group">
                <input
                  v-model="title"
                  required
                  type="text"
                  class="form-control form-control-lg"
                  placeholder="Article Title"
                />
              </fieldset>
              <fieldset class="form-group">
                <input
                  v-model="description"
                  type="text"
                  class="form-control"
                  placeholder="What's this article about?"
                />
              </fieldset>
              <fieldset class="form-group">
                <textarea
                  v-model="body"
                  required
                  class="form-control"
                  rows="8"
                  placeholder="Write your article (in markdown)"
                ></textarea>
              </fieldset>
              <fieldset class="form-group">
                <input
                  v-model="tagList"
                  type="text"
                  class="form-control"
                  placeholder="Enter tags"
                />
                <div class="tag-list"></div>
              </fieldset>
              <button
                class="btn btn-lg pull-xs-right btn-primary"
                type="button"
                @click="addArticle"
              >
                Publish Article
              </button>
            </fieldset>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { addArticle } from "@/service/article";
export default {
  name: "Eidt",
  middleware: "auth",
  data() {
    return {
      title: null,
      description: null,
      body: null,
      tagList: null,
    };
  },
  methods: {
    async addArticle() {
      try {
        let { title, description, body, tagList } = this;
        let res = await addArticle({
          article: {
            title,
            description,
            body,
            tagList: tagList.split(","),
          },
        });
        let slug = res.data.article.slug;
        this.$router.push({
          name: "Article",
          params: {
            slug,
          },
        });
      } catch (err) {
        console.log(err);
      }
    },
  },
};
</script>

<style></style>
