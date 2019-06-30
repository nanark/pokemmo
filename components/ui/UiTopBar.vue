<template>
  <section class="ui-top-bar">
    <div class="left">
      <UserAvatar :user="user" size="40px" />
    </div>
    <div class="right">
      <button class="toggle" @click="switchOnlineMode(!onlineMode)">
        <span :class="onlineMode ? `toggle-live` : `toggle-offline`" />
        {{ onlineModeLabel }}
      </button>
      <button class="toggle" @click="switchDebugMode(!debugMode)">
        {{ debugModeLabel }}
      </button>
      <button @click="disconnect">{{ $t("global.disconnect") }}</button>
    </div>
  </section>
</template>

<script>
import { mapState } from "vuex";
import UserAvatar from "@/components/users/UserAvatar";
import { Game } from "@/assets/scripts/game/Game";

export default {
  name: "UiTopBar",
  components: {
    UserAvatar
  },
  data() {
    return {
      debugMode: Game.debugMode,
      onlineMode: Game.online
    };
  },
  computed: {
    onlineModeLabel() {
      return this.onlineMode
        ? this.$t("global.online_on")
        : this.$t("global.online_off");
    },
    debugModeLabel() {
      return this.debugMode
        ? this.$t("global.debug_on")
        : this.$t("global.debug_off");
    },
    ...mapState({
      user: state => state.user
    })
  },
  methods: {
    disconnect() {
      this.$emit("disconnect", true);
      Game.disconnect();
    },
    switchDebugMode(mode) {
      this.debugMode = mode;
      Game.setDebug(mode);
    },
    switchOnlineMode(mode) {
      this.onlineMode = mode;
      Game.setOnline(mode);
    }
  }
};
</script>

<style lang="scss" scoped>
.ui-top-bar {
  align-items: center;
  background-color: $black;
  display: flex;
  justify-content: flex-end;
  width: 100%;
}

.left {
  flex-grow: 1;
  padding: 5px 10px;
  text-align: left;
}

.user-avatar {
  display: block;
}

.right {
  padding: 10px;
}

.toggle {
  border: 1px solid transparent;
  background-color: transparent;
  color: $white;
  cursor: pointer;
  padding: 4px 10px;
  font-size: 12px;
  font-weight: 800;
  text-transform: uppercase;
  transition: 0.3s;

  &:hover {
    border: 1px solid rgba($white, 0.4);
    border-radius: 4px;
  }

  span {
    display: inline-block;
    height: 10px;
    margin-right: 5px;
    width: 10px;

    &.toggle-live {
      background-color: green;
    }

    &.toggle-offline {
      background-color: red;
    }
  }
}
</style>
