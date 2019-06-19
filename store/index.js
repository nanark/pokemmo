import Vue from "vue";

export const state = () => ({
  locales: ["en", "fr"],
  locale: "fr",
  user: "",
  socket: {
    isConnected: false,
    message: "",
    reconnectError: false
  },
  users: [
    {
      id: 1,
      username: "nanark",
      avatar:
        "https://assets.pokemon.com/assets/cms2/img/pokedex/detail/054.png"
    },
    {
      id: 2,
      username: "jcbedier",
      avatar:
        "https://assets.pokemon.com/assets/cms2/img/pokedex/detail/094.png"
    },
    {
      id: 3,
      username: "Mehdi",
      avatar:
        "https://assets.pokemon.com/assets/cms2/img/pokedex/detail/143.png"
    }
  ]
});

export const mutations = {
  SET_USER(state, userId) {
    state.user = state.users.find(user => {
      return user.id === userId;
    });
  },
  SET_LANG(state, locale) {
    if (state.locales.indexOf(locale) !== -1) {
      state.locale = locale;
    }
  },
  SOCKET_ONOPEN(state, event) {
    Vue.prototype.$socket = event.currentTarget;
    state.socket.isConnected = true;
  },
  SOCKET_ONCLOSE(state) {
    state.socket.isConnected = false;
  },
  SOCKET_ONERROR(state, event) {
    console.error(state, event);
  },
  // default handler called for all methods
  SOCKET_ONMESSAGE(state, message) {
    state.socket.message = message;
  },
  // mutations for reconnect methods
  SOCKET_RECONNECT(state, count) {
    console.info(state, count);
  },
  SOCKET_RECONNECT_ERROR(state) {
    state.socket.reconnectError = true;
  }
};

export const actions = {
  setUser: function(context, userId) {
    context.commit("SET_USER", userId);
  },
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
