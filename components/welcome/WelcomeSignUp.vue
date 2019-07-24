<template>
  <section class="welcome-sign-up">
    <h2>{{ $t("auth.signup.title") }}</h2>
    <div class="description">
      {{ $t("auth.signup.description") }}
      <span class="link" @click="toggleBox">
        {{ $t("auth.signup.link") }}
      </span>
    </div>
    <div v-if="error" class="error">{{ error }}</div>
    <form method="post" @submit.prevent="onSubmit">
      <div class="field">
        <input
          v-model.trim="username"
          type="text"
          :placeholder="$t(`auth.signup.placeholders.username`)"
          name="username"
          required
        />
      </div>
      <div class="field">
        <input
          v-model.trim="email"
          type="email"
          :placeholder="$t(`auth.signup.placeholders.email`)"
          name="email"
          required
        />
      </div>
      <div class="field">
        <input
          v-model.trim="password"
          type="password"
          :placeholder="$t(`auth.signup.placeholders.password`)"
          name="password"
          required
        />
      </div>
      <div class="field">
        <input
          v-model.trim="passwordCopy"
          type="password"
          :placeholder="$t(`auth.signup.placeholders.password_copy`)"
          required
        />
      </div>
      <div class="field">
        <label>
          <input v-model="terms" type="checkbox" value="1" />
          {{ $t("auth.signup.terms") }}
          <span class="link">{{ $t("auth.signup.terms_link") }}</span>
        </label>
      </div>
      <div class="field">
        <input type="submit" :value="$t(`auth.signup.button`)" />
      </div>
    </form>
  </section>
</template>

<script>
export default {
  name: "WelcomeSignIn",
  data() {
    return {
      username: "",
      email: "",
      password: "",
      passwordCopy: "",
      terms: 0,
      error: ""
    };
  },
  methods: {
    // Register and login
    async onSubmit() {
      this.error = "";

      if (this.terms === 0) {
        this.error = "Please accept terms.";
        return false;
      }
      if (this.password != this.passwordCopy) {
        this.error = "Passwords don't match";
        return false;
      }
      try {
        await this.$store.dispatch("authentication/signUp", {
          username: this.username,
          email: this.email,
          password: this.password
        });
      } catch (error) {
        this.error = error.response.data.error;
      }
    },
    toggleBox() {
      this.$emit("toggleBox", true);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/components/welcome-sign.scss";
</style>
