<template>
  <ul class="ui-log">
    <li v-for="(log, i) in logs" :key="i">
      {{ log }}
    </li>
  </ul>
</template>

<script>
import { Game } from "@/assets/scripts/game/Game";

export default {
  name: "UiLog",
  data() {
    return {
      logs: Game.logs
    };
  }
};
</script>

<style lang="scss" scoped>
.ui-log {
  background-color: rgba($black, 0.15);
  color: $white;
  display: flex;
  flex-direction: column;
  font-size: 13px;
  height: 100%;
  list-style-type: none;
  opacity: 0;
  padding: 10px 20px;
  width: 300px;
  transition: 0.2s;

  &:hover {
    opacity: 1;
  }
}
</style>
