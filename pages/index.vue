<template>
  <section id="container">
    <template v-if="socket.isConnected">
      <UiTopBar @disconnect="disconnect" />
      <ViewportWindow id="viewport">
        <UiChatbox id="chatbox" />
      </ViewportWindow>
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

export default {
  components: {
    SignIn,
    UiChatbox,
    UiTopBar,
    ViewportWindow
  },
  data() {
    return {
      status: "disconnected"
    };
  },
  computed: mapState({
    socket: state => state.socket
  }),
  methods: {
    connect() {
      this.$connect("ws://ws.upody.com:7070/ws?user=3", {
        store: this.$store,
        connectManually: true,
        reconnection: true,
        format: "json"
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
}

#locales {
  font-size: 18px;

  span {
    cursor: pointer;
  }
}

#viewport {
  flex-grow: 1;
  width: 100%;
}
</style>
