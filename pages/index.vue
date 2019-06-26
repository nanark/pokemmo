<template>
  <section id="container">
    <template v-if="socket.isConnected">
      <UiTopBar @disconnect="disconnect" />
      <div id="viewportContainer">
        <UiChatbox id="chatbox" />
        <UiLog id="log" />
        <ViewportWindow id="viewport"> </ViewportWindow>
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
import UiTopBar from "@/components/ui/UiTopBar";
import ViewportWindow from "@/components/ViewportWindow";
import UiLog from "@/components/ui/UiLog";

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
      this.$connect(`ws://ws.upody.com:7070/ws?user=${this.user.id}`, {
        store: this.$store,
        connectManually: true,
        reconnection: true,
        format: "json",
        passToStoreHandler(eventName, event) {
          if (!eventName.startsWith("SOCKET_")) {
            return;
          }

          // let method = "commit";
          let target = eventName.toUpperCase();
          let msg = event;

          if (this.format === "json" && msg.data) {
            msg = JSON.parse(msg.data);

            if (msg.namespace) {
              target = `${msg.namespace}/${target}`;
            }
          }

          this.store.commit(target, msg);
        }
      });
      this.status = "connected";
    },
    disconnect() {
      this.$disconnect();
      this.status = "disconnected";
    },
    changeLocale(lang) {
      this.$store.dispatch("setLocale", lang);
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
  width: 100%;
}

#viewport {
  height: 100%;
  width: 100%;
}
</style>
