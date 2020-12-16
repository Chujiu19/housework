<template>
  <div class="settings-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">Your Settings</h1>

          <form action="javascript:void(0);">
            <fieldset>
              <fieldset class="form-group">
                <input
                  v-model="image"
                  class="form-control"
                  type="text"
                  placeholder="URL of profile picture"
                />
              </fieldset>
              <fieldset class="form-group">
                <input
                  required
                  v-model="username"
                  class="form-control form-control-lg"
                  type="text"
                  placeholder="Your Name"
                />
              </fieldset>
              <fieldset class="form-group">
                <textarea
                  v-model="bio"
                  class="form-control form-control-lg"
                  rows="8"
                  placeholder="Short bio about you"
                ></textarea>
              </fieldset>
              <fieldset class="form-group">
                <input
                  required
                  v-model="email"
                  class="form-control form-control-lg"
                  type="email"
                  placeholder="Email"
                />
              </fieldset>
              <fieldset class="form-group">
                <input
                  required
                  v-model="password"
                  minlength="8"
                  class="form-control form-control-lg"
                  type="password"
                  placeholder="Password"
                />
              </fieldset>
              <button
                class="btn btn-lg btn-primary pull-xs-right"
                @click="updateUser"
              >
                Update Settings
              </button>
            </fieldset>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { updateUser } from "@/service/user";
export default {
  name: "Setting",
  middleware: "auth",
  data() {
    return Object.assign(
      {
        image: "",
        username: "",
        bio: "",
        email: "",
        password: "",
      },
      this.$store.state.user
    );
  },
  methods: {
    async updateUser() {
      try {
        let { image, username, bio, email, password } = this;
        let res = await updateUser({
          user: {
            image,
            username,
            bio,
            email,
            password,
          },
        });
        let user = res.data.user;
        this.$store.commit("setUser", user);
        this.$router.push({
          name: "Profile",
          params: {
            username: user.username,
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
