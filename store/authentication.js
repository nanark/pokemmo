export const state = () => ({
  me: "",
  jwt: ""
});

export const mutations = {
  SET_JWT(state, jwt) {
    state.jwt = jwt;
  },
  SET_ME(state, me) {
    state.me = me;
  },
  DELETE_ME(state) {
    state.me = "";
  }
};

export const actions = {
  setJwt: (context, jwt) => {
    context.commit("SET_JWT", jwt);
  },
  deleteMe: context => {
    context.commit("DELETE_ME");

    context.dispatch("localStorage/setRefreshToken", "", {
      root: true
    });
  },
  async signIn(context, credentials) {
    const { accessToken, refreshToken } = await this.$axios.$post(
      "/user/signin",
      {
        email: credentials.email,
        password: credentials.password
      }
    );

    context.dispatch("localStorage/setRefreshToken", refreshToken, {
      root: true
    });
    context.commit("SET_JWT", accessToken);

    const me = await this.$axios.$get("/user/me");

    context.commit("SET_ME", me);
  },
  async signUp(context, credentials) {
    const { accessToken, refreshToken } = await this.$axios.$post(
      "/user/signup",
      {
        email: credentials.email,
        password: credentials.password,
        username: credentials.username
      }
    );

    context.dispatch("localStorage/setRefreshToken", refreshToken, {
      root: true
    });
    context.commit("SET_JWT", accessToken);

    const me = await this.$axios.$get("/user/me");

    context.commit("SET_ME", me);
  },
  async refreshToken(context) {
    const { accessToken } = await this.$axios.$get(
      `/user/refresh/${this.state.localStorage.refreshToken}`
    );

    context.commit("SET_JWT", accessToken);

    const me = await this.$axios.$get("/user/me");

    context.commit("SET_ME", me);
  }
};
