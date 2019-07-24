<template>
  <div class="viewport-window">
    <section class="viewport"></section>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { Game } from "@/assets/scripts/game/Game";

export default {
  name: "ViewportWindow",
  props: {
    me: {
      type: Object,
      required: true
    }
  },
  computed: mapState({
    users: state => state.users.users
  }),
  mounted() {
    // Init the Game object
    Game.init(this.me, this.users);
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
