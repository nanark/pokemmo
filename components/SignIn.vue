<template>
  <section class="sign-in">
    <div class="background">
      <button @click="signIn">Connection</button>
    </div>
  </section>
</template>

<script>
export default {
  name: "SignIn",
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
