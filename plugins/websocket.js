import Vue from "vue";
import VueNativeSock from "vue-native-websocket";

export const server = "wss://wss.zeapps.eu/ws";

export default ({ store }) => {
  Vue.use(VueNativeSock, server, {
    store: store,
    connectManually: true,
    reconnection: false,
    format: "json",
    passToStoreHandler(eventName, event) {
      if (!eventName.startsWith("SOCKET_")) {
        return;
      }

      // let method = "commit";
      let target = eventName.toUpperCase();
      let msg = event;

      if (this.format === "json" && msg.data) {
        msg = JSON.parse(msg.data);

        if (msg.namespace) {
          target = `${msg.namespace}/${target}`;
        }
      }

      this.store.commit(target, msg);
    }
  });
};
