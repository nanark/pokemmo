<template>
  <section class="ui-chatbox">
    <form action="#" @submit.prevent="sendMessage">
      <div class="container" @mouseover="focus" @mouseleave="blur">
        <ul class="log">
          <li v-for="(log, index) in logs" :key="index">
            {{ log.event }} {{ log.data }}
          </li>
        </ul>
        <transition name="fade">
          <input
            v-if="showInput"
            ref="input"
            v-model="messageInput"
            class="message-input"
            :placeholder="$t(`chatbox.placeholder`)"
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
      this.logs.push({
        event: `${this.$t("chatbox.player_name")}: `,
        data: this.messageInput
      });
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
  border-radius: 3px;
  display: flex;
  flex-direction: column;
  height: 300px;
  padding: 0;
  width: 400px;
}

.log {
  flex-grow: 1;
  list-style-type: none;
  margin: 0;
  padding: 10px;
  text-shadow: 0 0 3px rgba($black, 0.8);
}

.message-input {
  background-color: rgba($black, 0.65);
  border: 0;
  border-radius: 0 0 3px 3px;
  color: $white;
  padding: 10px;
}
</style>
