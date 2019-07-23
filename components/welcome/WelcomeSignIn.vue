<template>
  <section class="welcome-sign-in">
    <h2>{{ $t("auth.signin.title") }}</h2>
    <div class="description">
      {{ $t("auth.signin.description") }}
      <span class="link" @click="toggleBox">
        {{ $t("auth.signin.link") }}
      </span>
    </div>
    <div v-if="error" class="error">{{ error }}</div>
    <form method="post" @submit.prevent="onSubmit">
      <div class="field">
        <input
          v-model.trim="email"
          type="email"
          :placeholder="$t(`auth.signin.placeholders.email`)"
          name="email"
          required
        />
      </div>
      <div class="field">
        <input
          v-model.trim="password"
          type="password"
          :placeholder="$t(`auth.signin.placeholders.password`)"
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
        <input type="submit" :value="$t(`auth.signin.button`)" />
      </div>
    </form>
  </section>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "WelcomeSignIn",
  data() {
    return {
      email: "",
      password: "",
      error: ""
    };
  },
  computed: mapState({
    locales: state => state.locales
  }),
  methods: {
    // Login
    async onSubmit() {
      this.error = "";

      try {
        await this.$store.dispatch("authentication/signIn", {
          email: this.email,
          password: this.password
        });
      } catch {
        this.error = "Error during authentication";
      }
    },
    toggleBox() {
      this.$emit("toggleBox", false);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/components/welcome-sign.scss";
</style>
