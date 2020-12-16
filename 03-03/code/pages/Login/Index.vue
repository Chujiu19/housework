<template>
  <div class="auth-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">Sign {{ isLogin ? "in" : "up" }}</h1>
          <p class="text-xs-center">
            <nuxt-link v-if="!isLogin" to="/Login">Have an account?</nuxt-link>
            <nuxt-link v-else to="/Register">Register an account?</nuxt-link>
          </p>

          <ul v-if="isError" class="error-messages">
            <li v-for="(item, key, i) in errors" :key="i">
              {{ key }} {{ item && item.join("&") }}
            </li>
          </ul>

          <form action="javascript:void(0);">
            <fieldset class="form-group">
              <input
                v-if="!isLogin"
                v-model="user.username"
                class="form-control form-control-lg"
                type="text"
                placeholder="Your Name"
              />
            </fieldset>
            <fieldset class="form-group">
              <input
                v-model="user.email"
                class="form-control form-control-lg"
                type="text"
                placeholder="Email"
              />
            </fieldset>
            <fieldset class="form-group">
              <input
                v-model="user.password"
                class="form-control form-control-lg"
                type="password"
                placeholder="Password"
              />
            </fieldset>
            <button class="btn btn-lg btn-primary pull-xs-right" @click="login">
              Sign {{ isLogin ? "in" : "up" }}
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const Cookie = process.client ? require("js-cookie") : undefined;
import { login, register } from "@/service/user";
export default {
  name: "Login",
  middleware: 'noauth',
  data() {
    return {
      user: {
        username: null,
        email: null,
        password: null,
      },
      isError: false,
      errors: null,
    };
  },
  computed: {
    isLogin() {
      return this.$route.name == "Login";
    },
  },
  methods: {
    async login() {
      try {
        const res = await (this.isLogin ? login : register)({
          user: this.user,
        });
        const { user } = res.data;
        Cookie.set("user", user);
        Cookie.set('auth', user.token)
        this.$store.commit("setUser", user);
        this.$router.push("/");
      } catch (err) {
        this.isError = true;
        this.errors = err.response.data.errors;
      }
    },
  },
};
</script>

<style></style>
