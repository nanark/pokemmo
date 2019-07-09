<template>
  <div class="viewport-window">
    <section class="viewport"></section>
  </div>
</template>

<script>
import { Game } from "@/assets/scripts/game/Game";

export default {
  name: "ViewportWindow",
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  mounted() {
    // Init the Game object
    Game.init(this.user.id);
    Game.setWebsocket(this.$socket);

    // Bind it to the DOM
    document.querySelector(".viewport").appendChild(Game.display.app.view);
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
