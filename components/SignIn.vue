<template>
  <section class="sign-in">
    <div class="background">
      <select v-model="$i18n.locale">
        <option v-for="(lang, i) in locales" :key="`Lang${i}`" :value="lang">{{
          lang
        }}</option>
      </select>
      <button @click="signIn">{{ $t("global.connect") }}</button>
    </div>
  </section>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "SignIn",
  computed: mapState(["locales"]),
  methods: {
    signIn() {
      this.$emit("signInClicked", true);
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
</style>
