import Vue from "vue";
import VueNativeSock from "vue-native-websocket";

const server = "ws://ws.upody.com:7070/ws?user=2";

export default ({ store }) => {
  Vue.use(VueNativeSock, server, { store: store, reconnection: true });
};
