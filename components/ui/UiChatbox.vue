<template>
  <section class="ui-chatbox">
    <form action="#" @submit.prevent="sendMessage">
      <div class="container" @mouseover="focus" @mouseleave="blur">
        <ul v-chat-scroll="{ always: false, smooth: true }" class="log">
          <li v-for="(log, index) in logs" :key="index" :class="log.class">
            {{ log.author }}: {{ log.data }}
          </li>
        </ul>
        <input
          ref="input"
          v-model="messageInput"
          class="message-input"
          :placeholder="$t(`chatbox.placeholder`)"
        />
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
      messageInput: "",
      logs: []
    };
  },
  computed: mapState({
    socket: state => state.socket
  }),
  created() {
    this.$options.sockets.onmessage = data => {
      const dataParsed = JSON.parse(data.data);
      if (dataParsed.namespace && dataParsed.namespace === "chat") {
        this.logs.push({
          class: "message",
          author: dataParsed.data.user.username,
          data: dataParsed.data.message
        });
      }
    };
  },
  methods: {
    sendMessage() {
      if (!this.messageInput.trim()) {
        this.messageInput = "";
        return false;
      }

      this.$store.dispatch("chat/sendMessage", this.messageInput);
      this.logs.push({
        class: "own",
        author: this.$t("chatbox.player_name"),
        data: this.messageInput
      });
      this.messageInput = "";
    },
    focus() {
      this.$refs.input.style.opacity = 1;
      this.$nextTick(() => this.$refs.input.focus());
    },
    blur() {
      this.$refs.input.style.opacity = 0.2;
      this.$nextTick(() => this.$refs.input.blur());
    }
  }
};
</script>

<style lang="scss" scoped>
.ui-chatbox {
  pointer-events: none;
}

.container {
  background-color: rgba($black, 0.2);
  border-radius: 3px;
  display: flex;
  flex-direction: column;
  height: 300px;
  padding: 0;
  width: 400px;
}

.log {
  color: $white;
  flex-grow: 1;
  list-style-type: none;
  margin: 0;
  overflow: auto;
  padding: 10px;
  text-shadow: 0 0 3px rgba($black, 0.8);

  .message {
    color: yellow;
  }
}

.message-input {
  background-color: rgba($black, 0.65);
  border: 0;
  border-radius: 0 0 3px 3px;
  color: $white;
  opacity: 0.2;
  padding: 10px;
  pointer-events: auto;
  transition: 0.25s;
}
</style>
