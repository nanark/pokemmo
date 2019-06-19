<template>
  <section class="welcome-sign-in">
    <div class="background">
      <div>
        <WelcomeUsers @clickedUser="signIn()" />
        <div class="action">
          <select v-model="$i18n.locale">
            <option v-for="(lang, i) in locales" :key="i" :value="lang">
              {{ lang }}
            </option>
          </select>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { mapState } from "vuex";
import WelcomeUsers from "./WelcomeUsers";

export default {
  name: "WelcomeSignIn",
  components: {
    WelcomeUsers
  },
  computed: mapState(["users", "locales"]),
  methods: {
    signIn() {
      this.$emit("signInClicked", true);
    },
    setAvatarStyle(url) {
      return `background-image: url(${url});`;
    }
  }
};
</script>

<style lang="scss" scoped>
.background {
  align-items: center;
  background-color: $black;
  bottom: 0;
  cursor: default;
  display: flex;
  height: 100vh;
  justify-content: center;
  left: 0;
  position: fixed;
  right: 0;
  top: 0;
  width: 100%;
}

.action {
  padding-top: 30px;
  text-align: center;
}
</style>
