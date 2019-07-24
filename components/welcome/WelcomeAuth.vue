<template>
  <div class="box">
    <template v-if="login">
      <WelcomeSignIn @toggleBox="toggleBox()" />
    </template>
    <template v-else>
      <WelcomeSignUp @toggleBox="toggleBox()" />
    </template>
  </div>
</template>

<script>
import WelcomeSignIn from "@/components/welcome/WelcomeSignIn";
import WelcomeSignUp from "@/components/welcome/WelcomeSignUp";

export default {
  name: "WelcomeAuth",
  components: {
    WelcomeSignIn,
    WelcomeSignUp
  },
  data() {
    return {
      login: true
    };
  },
  methods: {
    toggleBox() {
      this.login = !this.login;
    }
  }
};
</script>

<style lang="scss" scoped>
.box {
  background: $white;
  border-radius: 3px;
  box-shadow: 0 0 10px rgba($black, 0.3);
  display: block;
  padding: 30px;
  width: 390px;
}
</style>
