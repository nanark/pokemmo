<template>
  <section class="welcome-sign-in">
    <template v-if="login">
      <h2>Welcome back!</h2>
      <div class="description">
        If you don't have an account yet,
        <span class="link" @click="login = !login">create one</span>
      </div>
      <div class="field">
        <input type="text" placeholder="Your email" />
      </div>
      <div class="field">
        <input type="password" placeholder="Your secret password" />
      </div>
      <div class="field">
        <select v-model="$i18n.locale">
          <option v-for="(lang, i) in locales" :key="i" :value="lang">
            {{ lang }}
          </option>
        </select>
      </div>
      <div class="field">
        <input type="submit" value="Log in" />
      </div>
    </template>
    <template v-else>
      <h2>Create an account</h2>
      <div class="description">
        If you already have an account,
        <span class="link" @click="login = !login">click here</span>
      </div>
      <div class="field">
        <input type="text" placeholder="Choose your username" />
      </div>
      <div class="field">
        <input type="text" placeholder="Your email" />
      </div>
      <div class="field">
        <input type="password" placeholder="Type a secret password" />
      </div>
      <div class="field">
        <input type="password" placeholder="Confirm your password" />
      </div>
      <div class="field">
        <label>
          <input type="checkbox" /> I accept the
          <span class="link">Terms of Use</span> &
          <span class="link">Privacy Policy</span>
        </label>
      </div>
      <div class="field">
        <input type="submit" value="Create the account" />
      </div>
    </template>
  </section>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "WelcomeSignIn",
  data() {
    return {
      login: true
    };
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
.welcome-sign-in {
  background: $white;
  border-radius: 3px;
  box-shadow: 0 0 10px rgba($black, 0.3);
  display: block;
  padding: 30px;
  width: 390px;
}

h2 {
  color: $grey-mineshaft;
  font-size: 30px;
}

.description {
  font-size: 14px;
  margin-bottom: 20px;
}

.field {
  font-size: 14px;
  padding: 10px 0;
}

input[type="text"],
input[type="password"] {
  background-color: $grey-concrete;
  border: 0;
  border-radius: 3px;
  box-shadow: none !important;
  color: $grey-emperor;
  display: block;
  font-size: 16px;
  padding: 12px;
  width: 100%;

  &::placeholder {
    color: rgba($grey-emperor, 0.5);
  }
}

input[type="submit"] {
  background-color: $blue-dodger;
  border: 0;
  border-radius: 3px;
  color: $white;
  cursor: pointer;
  display: block;
  font-size: 16px;
  padding: 12px;
  width: 100%;
}

.action {
  padding-top: 30px;
  text-align: center;
}
</style>
