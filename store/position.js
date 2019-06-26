// import Vue from "vue";

export const state = () => ({
  x: 0,
  y: 0
});

export const mutations = {
  SOCKET_ONMESSAGE(state, position) {
    const positionData = position.data;
    state.x = positionData.x;
    state.y = positionData.y;
  }
};
