<template>
  <ul class="ui-log">
    <li v-for="(log, i) in logs" :key="i">
      {{ logDate(log) }}
      {{ log.message }}
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
  },
  methods: {
    logDate(log) {
      const date = new Date(log.date);
      let minutes = date.getMinutes();
      if (minutes < 10) {
        minutes = `0${minutes}`;
      }
      return `${date.getHours()}h${minutes}`;
    }
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
  transition: 0.2s;
  width: 300px;

  &:hover {
    opacity: 1;
  }
}
</style>
