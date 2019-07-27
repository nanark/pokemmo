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
  async getMe(context) {
    const me = await this.$axios.$get("/user/me");

    context.commit("SET_ME", me);
  },
  deleteMe: context => {
    context.commit("DELETE_ME");
    context.dispatch("localStorage/setTokens", "", { root: true });
  },
  async signIn(context, credentials) {
    const payload = {
      email: credentials.email,
      password: credentials.password
    };
    const data = await this.$axios.$post("/user/signin", payload);

    context.dispatch("connecting", data);
  },
  async signUp(context, credentials) {
    const payload = {
      email: credentials.email,
      password: credentials.password,
      username: credentials.username
    };
    const data = await this.$axios.$post("/user/signup", payload);

    context.dispatch("connecting", data);
  },
  async refreshToken(context) {
    const data = await this.$axios.$get(
      `/user/refresh/${this.state.localStorage.refreshToken}`
    );

    context.dispatch("connecting", data);
  },
  async connecting(context, { refreshToken, accessToken }) {
    const payload = {
      jwt: accessToken,
      refreshToken
    };
    context.dispatch("localStorage/setTokens", payload, {
      root: true
    });
    context.commit("SET_JWT", accessToken);

    const me = await this.$axios.$get("/user/me");

    context.commit("SET_ME", me);
  }
};
