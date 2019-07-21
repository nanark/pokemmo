<template>
  <section id="container">
    <template v-if="user">
      <UiTopBar @disconnect="disconnect" />
      <div id="viewportContainer">
        <UiChatbox id="chatbox" />
        <UiLog id="log" />
        <ViewportWindow id="viewport" :user="user"> </ViewportWindow>
      </div>
    </template>
    <template v-else>
      <SignIn @signInClicked="connect" />
    </template>
  </section>
</template>

<script>
import { mapState } from "vuex";
import SignIn from "@/components/welcome/WelcomeSignIn";
import UiChatbox from "@/components/ui/UiChatbox";
import UiLog from "@/components/ui/UiLog";
import UiTopBar from "@/components/ui/UiTopBar";
import ViewportWindow from "@/components/ViewportWindow";
import { Game } from "@/assets/scripts/game/Game";

export default {
  components: {
    SignIn,
    UiChatbox,
    UiLog,
    UiTopBar,
    ViewportWindow
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
    connect() {
      // Purge game instance
      Game.disconnect();

      this.connectWebSocket();
      this.status = "connected";
    },
    connectWebSocket() {
      this.$connect(`ws://ws.upody.com:7070/ws?user=${this.user.id}`);
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

#log {
  bottom: 0;
  right: 0;
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
  height: 100%;
  width: 100%;
}

#viewport {
  height: 100%;
  width: 100%;
}
</style>
