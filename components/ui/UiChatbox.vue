<template>
  <section class="ui-chatbox">
    <form action="#" @submit.prevent="sendMessage">
      <div class="container" @mouseover="focus" @mouseleave="blur">
        <ul class="log">
          <li v-for="(log, index) in logs" :key="index">
            {{ log.event }}: {{ log.data }}
          </li>
        </ul>
        <transition name="fade">
          <input
            v-if="showInput"
            ref="input"
            v-model="messageInput"
            class="message-input"
          />
        </transition>
      </div>
    </form>
  </section>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "UiChatbox",
  data() {
    return {
      showInput: false,
      messageInput: "",
      logs: []
    };
  },
  computed: mapState({
    socket: state => state.socket
  }),
  created() {
    this.$options.sockets.onmessage = data =>
      this.logs.push({ event: "Message received", data: data.data });
  },
  methods: {
    sendMessage() {
      this.$store.dispatch("sendMessage", this.messageInput);
      this.logs.push({ event: "You: ", data: this.messageInput });
      this.messageInput = "";
    },
    focus() {
      this.showInput = true;
      this.$nextTick(() => this.$refs.input.focus());
    },
    blur() {
      this.showInput = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.container {
  background-color: rgba($black, 0.4);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  height: 300px;
  padding: 20px;
  width: 400px;
}

.log {
  flex-grow: 1;
  list-style-type: none;
  margin: 0;
  padding: 0;
}
</style>
