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
  },
  SET_TOKENS(state, data) {
    if (data) {
      sessionStorage.setItem("jwt", data.jwt);
      localStorage.setItem("refreshToken", data.refreshToken);
    } else {
      sessionStorage.removeItem("jwt");
      localStorage.removeItem("refreshToken", data.refreshToken);
    }
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
    context.commit("SET_TOKENS", "");
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
    const uri = `/user/refresh/${localStorage.getItem("refreshToken")}`;
    const data = await this.$axios.$get(uri);

    context.dispatch("connecting", data);
  },
  async connecting(context, { refresh_token, access_token }) {
    const payload = {
      jwt: access_token,
      refreshToken: refresh_token
    };
    context.commit("SET_TOKENS", payload);
    context.commit("SET_JWT", access_token);

    const me = await this.$axios.$get("/user/me");

    context.commit("SET_ME", me);
  }
};
