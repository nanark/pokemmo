export const state = () => ({
  refreshToken: ""
});

export const mutations = {
  SET_REFRESH_TOKEN(state, refreshToken) {
    state.refreshToken = refreshToken;
  }
};

export const actions = {
  setRefreshToken: function(context, refreshToken) {
    context.commit("SET_REFRESH_TOKEN", refreshToken);
  }
};
