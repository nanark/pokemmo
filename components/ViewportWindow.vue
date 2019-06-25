<template>
  <section id="viewport" class="viewport-window"></section>
</template>

<script>
import { Game } from "@/assets/scripts/game/Game";

export default {
  name: "ViewportWindow",
  mounted() {
    // Init the Game object
    Game.init();

    // Bind it to the DOM
    document.getElementById("viewport").appendChild(Game.display.app.view);
  }
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
