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
    document.addEventListener("keydown", this.onKeyDown);
    document.addEventListener("keyup", this.onKeyUp);
  },
  methods: {
    onKeyDown(key) {
      if (key.keyCode === 87 || key.keyCode === 38) {
        Game.player.go("up");
        Game.playerDirection = "up";
        Game.player.sprite.y -= 8;
      }

      if (key.keyCode === 83 || key.keyCode === 40) {
        Game.player.go("down");
        Game.playerDirection = "down";
        Game.player.sprite.y += 8;
      }

      if (key.keyCode === 65 || key.keyCode === 37) {
        Game.player.go("left");
        Game.playerDirection = "left";
        Game.player.sprite.x -= 8;
      }

      if (key.keyCode === 68 || key.keyCode === 39) {
        Game.player.go("right");
        Game.playerDirection = "right";
        Game.player.sprite.x += 8;
      }
    },
    onKeyUp() {
      Game.player.stand(Game.playerDirection);
    }
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
