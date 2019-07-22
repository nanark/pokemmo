<template>
  <section class="welcome-sign-in">
    <template v-if="login">
      <h2>Welcome back!</h2>
      <div class="description">
        If you don't have an account yet,
        <span class="link" @click="login = !login">create one</span>
      </div>
      <div v-if="error" class="error">{{ error }}</div>
      <form method="post" @submit.prevent="signin">
        <div class="field">
          <input
            v-model.trim="email"
            type="text"
            placeholder="Your email"
            name="email"
            required
          />
        </div>
        <div class="field">
          <input
            v-model.trim="password"
            type="password"
            placeholder="Your secret password"
            name="password"
            required
          />
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
      </form>
    </template>
    <template v-else>
      <h2>Create an account</h2>
      <div class="description">
        If you already have an account,
        <span class="link" @click="login = !login">click here</span>
      </div>
      <div v-if="error" class="error">{{ error }}</div>
      <form method="post" @submit.prevent="signup">
        <div class="field">
          <input
            v-model.trim="username"
            type="text"
            placeholder="Choose your username"
            name="username"
            required
          />
        </div>
        <div class="field">
          <input
            v-model.trim="email"
            type="text"
            placeholder="Your email"
            name="email"
            required
          />
        </div>
        <div class="field">
          <input
            v-model.trim="password"
            type="password"
            placeholder="Type a secret password"
            name="password"
            required
          />
        </div>
        <div class="field">
          <input
            v-model.trim="passwordCopy"
            type="password"
            placeholder="Confirm your password"
            required
          />
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
      </form>
    </template>
  </section>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "WelcomeSignIn",
  data() {
    return {
      login: true,
      username: "",
      email: "",
      password: "",
      passwordCopy: "",
      error: ""
    };
  },
  computed: mapState({
    users: state => state.users,
    locales: state => state.locales
  }),
  methods: {
    // Login
    async signin() {
      try {
        const response = await this.$axios.post("/user/signin", {
          email: this.email,
          password: this.password
        });

        const data = await response.data;
        const jwt = data.accessToken;
        const refreshToken = data.refreshToken;

        this.$store.dispatch("localStorage/setRefreshToken", refreshToken);
        this.$store.dispatch("setJwt", jwt);
      } catch (error) {
        this.error = error.response.data.error;
      }
    },
    // Register and login
    async signup() {
      try {
        const response = await this.$axios.post("/user/signup", {
          username: this.username,
          email: this.email,
          password: this.password
        });

        const data = await response.data;
        const jwt = data.accessToken;
        const refreshToken = data.refreshToken;

        this.$store.dispatch("localStorage/setRefreshToken", refreshToken);
        this.$store.dispatch("setJwt", jwt);
      } catch (error) {
        this.error = error.response.data.error;
      }
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
input[type="email"],
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

.error {
  background-color: rgba($red, 0.2);
  border-radius: 4px;
  color: $red;
  margin: 10px 0;
  padding: 10px;
}

.action {
  padding-top: 30px;
  text-align: center;
}
</style>
