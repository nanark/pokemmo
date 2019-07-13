import Vue from "vue";
import { Game } from "@/assets/scripts/game/Game";

export const state = () => ({
  locales: ["en", "fr"],
  locale: "fr",
  user: "",
  socket: {
    isConnected: false,
    message: "",
    reconnectError: false
  },
  users: []
});

export const mutations = {
  SET_USERS(state, users) {
    // Sort the users by id
    state.users = users.sort((a, b) => {
      return a.id - b.id;
    });
  },
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
    Game.disconnect();
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
  async getUsers({ commit }) {
    const users = await this.$axios.$get("https://api.zeapps.eu/users/online");
    commit("SET_USERS", users);
  }
};
