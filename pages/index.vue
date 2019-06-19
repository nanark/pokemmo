<template>
  <section class="container">
    <ViewportWindow id="viewport" />
    <template v-if="socket.isConnected">
      <form action="#" @submit.prevent="sendMessage">
        <input v-model="messageInput" /><button type="submit">
          Send Message
        </button>
        <div @click="disconnect">Disco</div>
      </form>
      <ul id="logs">
        <li v-for="(log, index) in logs" :key="index" class="log">
          {{ log.event }}: {{ log.data }}
        </li>
      </ul>
    </template>
    <template v-else>
      <button @click="connect">Connect</button>
    </template>
  </section>
</template>

<script>
import { mapState } from "vuex";
import ViewportWindow from "@/components/ViewportWindow";

export default {
  components: {
    ViewportWindow
  },
  data() {
    return {
      messageInput: "",
      logs: [],
      status: "disconnected"
    };
  },
  computed: mapState({
    socket: state => state.socket
  }),
  created() {
    console.log(this);
    this.$options.sockets.onmessage = data =>
      this.logs.push({ event: "Message received", data: data.data });
  },
  methods: {
    // connect() {
    //   // $socket is [WebSocket](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket) instance
    //   this.$socket.send("some data");
    //   // or with {format: 'json'} enabled
    //   this.$socket.send("some data");
    // },
    // connect() {
    //   ws.onmessage = ({ data }) => {
    //     this.logs.push({ event: "Received message", data });
    //   };
    // },
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
    sendMessage() {
      // message = {

      // }
      this.$store.dispatch("sendMessage", this.messageInput);
      this.logs.push({ event: "Sent message", data: this.messageInput });
      this.messageInput = "";
    }
  }
};
</script>

<style>
#viewport {
  width: 100%;
  height: 20vh;
}
</style>
