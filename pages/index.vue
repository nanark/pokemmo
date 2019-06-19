<template>
  <section id="container">
    <template v-if="socket.isConnected">
      <div id="topbar"><button @click="disconnect">Disconnect</button></div>
      <ViewportWindow id="viewport"><UiChatbox id="chatbox"/></ViewportWindow>
    </template>
    <template v-else>
      <SignIn @signInClicked="connect" />
    </template>
  </section>
</template>

<script>
import { mapState } from "vuex";
import SignIn from "@/components/SignIn";
import UiChatbox from "@/components/ui/UiChatbox";
import ViewportWindow from "@/components/ViewportWindow";

export default {
  components: {
    SignIn,
    UiChatbox,
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

#topbar {
  align-items: center;
  background-color: $black;
  display: flex;
  justify-content: flex-end;
  padding: 10px;
  width: 100%;
}

#viewport {
  flex-grow: 1;
  width: 100%;
}
</style>
