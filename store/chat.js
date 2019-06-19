import Vue from "vue";

export const state = () => ({
  message: ""
});

export const mutations = {
  SOCKET_ONMESSAGE(state, message) {
    state.message = message;
  }
};

export const actions = {
  sendMessage: function(context, message) {
    const payload = {
      namespace: "chat",
      event_type: "message",
      data: {
        message: message
      }
    };
    Vue.prototype.$socket.send(JSON.stringify(payload));
  }
};
