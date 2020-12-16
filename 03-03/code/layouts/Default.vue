<template>
  <div>
    <nav class="navbar navbar-light">
      <div class="container">
        <nuxt-link class="navbar-brand" to="/">conduit</nuxt-link>
        <ul class="nav navbar-nav pull-xs-right">
          <li class="nav-item">
            <!-- Add "active" class when you're on that page" -->
            <nuxt-link class="nav-link" to="/">Home</nuxt-link>
          </li>
          <li v-if="!user" class="nav-item">
            <nuxt-link class="nav-link" to="/login">Sign up/Sign in</nuxt-link>
          </li>
          <template v-else>
            <li class="nav-item">
              <nuxt-link class="nav-link" to="/edit"
                ><i class="ion-compose"></i>&nbsp;New Post</nuxt-link
              >
            </li>
            <li class="nav-item">
              <nuxt-link class="nav-link" to="/settings"
                ><i class="ion-gear-a"></i>&nbsp;Settings</nuxt-link
              >
            </li>
            <li class="nav-item">
              <nuxt-link
                class="nav-link"
                :to="{
                  name: 'Profile',
                  query: {
                    username: user.username,
                  },
                }"
              >
                <img :src="user.image" alt="" class="user-pic" />
                {{ user.username }}
              </nuxt-link>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="javascript:void(0);" @click="signOut"
                >Sign out</a
              >
            </li>
          </template>
        </ul>
      </div>
    </nav>
    <nuxt-child></nuxt-child>
    <footer>
      <div class="container">
        <a href="/" class="logo-font">conduit</a>
        <span class="attribution">
          An interactive learning project from
          <a href="https://thinkster.io">Thinkster</a>. Code &amp; design
          licensed under MIT.
        </span>
      </div>
    </footer>
  </div>
</template>

<script>
const Cookie = process.client ? require("js-cookie") : undefined;
export default {
  computed: {
    user() {
      return this.$store.state.user;
    },
  },
  methods: {
    signOut() {
      this.$store.commit("setUser", null);
      Cookie.remove("user");
      this.$router.push("/login");
    },
  },
};
</script>

<style></style>
