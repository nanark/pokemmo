<template>
  <div class="viewport-window">
    <section class="viewport"></section>
    <div id="zone_joystick"></div>
  </div>
</template>

<script>
import { Game } from "@/assets/scripts/game/Game";

export default {
  name: "ViewportWindow",
  props: {
    me: {
      type: Object,
      required: true
    }
  },
  mounted() {
    // Init the Game object
    Game.init(this.me);
    Game.setWebsocket(this.$socket);

    // Bind it to the DOM
    document.querySelector(".viewport").appendChild(Game.display.view);
  },
  methods: {}
};
</script>

<style lang="scss" scoped>
.viewport {
  background-color: $black;
  height: 100%;
  position: relative;
}
</style>
