export const state = () => ({
  refreshToken: ""
});

export const mutations = {
  SET_TOKENS(state, data) {
    if (data) {
      sessionStorage.setItem("jwt", data.jwt);
      state.refreshToken = data.refreshToken;
    } else {
      sessionStorage.setItem("jwt", "");
      state.refreshToken = "";
    }
  }
};

export const actions = {
  setTokens: function(context, data) {
    context.commit("SET_TOKENS", data);
  }
};
