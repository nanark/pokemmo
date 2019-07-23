<template>
  <section id="container">
    <template v-if="user">
      <UiTopBar @disconnect="disconnect" />
      <div id="viewportContainer">
        <UiChatbox id="chatbox" />
        <ViewportWindow id="viewport" :user="user"> </ViewportWindow>
      </div>
    </template>
    <template v-else>
      <div class="cover" />
      <div id="sign">
        <WelcomeAuth />
      </div>
    </template>
  </section>
</template>

<script>
import { mapState } from "vuex";
import WelcomeAuth from "@/components/welcome/WelcomeAuth";
import UiChatbox from "@/components/ui/UiChatbox";
import UiTopBar from "@/components/ui/UiTopBar";
import ViewportWindow from "@/components/ViewportWindow";
import { Game } from "@/assets/scripts/game/Game";

export default {
  components: {
    UiChatbox,
    UiTopBar,
    ViewportWindow,
    WelcomeAuth
  },
  data() {
    return {
      status: "disconnected"
    };
  },
  computed: mapState({
    user: state => state.user,
    socket: state => state.socket
  }),
  methods: {
    create() {
      // Purge game instance
      Game.disconnect();

      this.connectWebSocket();
      this.status = "connected";
    },
    connect() {
      // Purge game instance
      Game.disconnect();

      this.connectWebSocket();
      this.status = "connected";
    },
    connectWebSocket() {
      this.$connect(`wss://wss.zeapps.eu/ws?user=${this.user.id}`);
    },
    disconnect() {
      // Disconnect websocket
      this.$disconnect();

      // Purge game instance
      Game.disconnect();

      this.status = "disconnected";
    }
  }
};
</script>

<style lang="scss" scoped>
#container {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
  height: 100vh;
  width: 100%;
}

#chatbox {
  bottom: 10px;
  left: 10px;
  position: absolute;
  z-index: 3;
}

#locales {
  font-size: 18px;

  span {
    cursor: pointer;
  }
}

#viewportContainer {
  position: relative;
  flex-grow: 1;
  height: calc(100% - 50px);
  width: 100%;
}

#viewport {
  height: 100%;
  width: 100%;
}

#sign {
  align-items: center;
  background-color: rgba($black, 0.5);
  bottom: 0;
  cursor: default;
  display: flex;
  height: 100vh;
  justify-content: center;
  left: 0;
  position: fixed;
  right: 0;
  top: 0;
  width: 100%;
}

.cover {
  align-items: center;
  background: url("/images/background.jpg") bottom center;
  background-size: cover;
  bottom: 0;
  cursor: default;
  display: flex;
  height: 100vh;
  left: 0;
  position: fixed;
  right: 0;
  top: 0;
  width: 100%;
}
</style>
