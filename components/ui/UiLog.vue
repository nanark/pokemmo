<template>
  <section class="ui-log">
    {{ log }}
  </section>
</template>

<script>
import { Game } from "@/assets/scripts/game/Game";

export default {
  name: "UiLog",
  computed: {
    log() {
      return Game.log;
    }
  }
};
</script>

<style lang="scss" scoped>
.ui-log {
  background-color: $black;
  color: $white;
  width: 100%;
}
</style>
