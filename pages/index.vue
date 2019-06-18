<template>
  <section class="container">
    <ViewportWindow id="viewport" />
    <div>
      <form action="#" @submit.prevent="sendMessage">
        <input v-model="messageInput" /><button type="submit">
          Send Message
        </button>
      </form>
      <ul id="logs">
        <li v-for="(log, index) in logs" :key="index" class="log">
          {{ log.event }}: {{ log.data }}
        </li>
      </ul>
    </div>
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
    console.log("============================================");
    console.log(this.$socket);
    console.log("============================================");
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
    // disconnect() {
    //   ws.close();
    //   this.status = "disconnected";
    //   this.logs = [];
    // },
    sendMessage() {
      this.$store.dispatch("sendMessage", this.messageInput);
      this.logs.push({ event: "Sent message", data: this.messageInput });
      console.log(this.socket);
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
