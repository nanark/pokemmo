<template>
  <section class="viewport-window">
    <slot />
  </section>
</template>

<script>
export default {
  name: "ViewportWindow"
};
</script>

<style lang="scss" scoped>
.viewport-window {
  background: url("/background.png");
  background-size: cover;
  color: $white;
  position: relative;
}
</style>
