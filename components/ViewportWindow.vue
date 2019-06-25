<template>
  <div class="viewport-window">
    <section class="viewport"></section>
  </div>
</template>

<script>
import { Game } from "@/assets/scripts/game/Game";

export default {
  name: "ViewportWindow",
  mounted() {
    // Init the Game object
    Game.init();

    // Bind it to the DOM
    document.querySelector(".viewport").appendChild(Game.display.app.view);
  }
};
</script>

<style lang="scss" scoped>
.viewport {
  background: url("/background.png");
  background-size: cover;
  color: $white;
  height: 100%;
  position: relative;
}
</style>
