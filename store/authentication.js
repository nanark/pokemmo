export const state = () => ({
  jwt: ""
});

export const mutations = {
  SET_JWT(state, jwt) {
    state.jwt = jwt;
  }
};

export const actions = {
  setJwt: (context, jwt) => {
    context.commit("SET_JWT", jwt);
  },
  async signIn(context, credentials) {
    const { jwt, refreshToken } = await this.$axios.$post("/user/signin", {
      email: credentials.email,
      password: credentials.password
    });

    context.dispatch("localStorage/setRefreshToken", refreshToken, {
      root: true
    });
    context.commit("SET_JWT", jwt);
  },
  async signUp(context, credentials) {
    const { jwt, refreshToken } = await this.$axios.$post("/user/signup", {
      email: credentials.email,
      password: credentials.password,
      username: credentials.username
    });

    context.dispatch("localStorage/setRefreshToken", refreshToken, {
      root: true
    });
    context.commit("SET_JWT", jwt);
  }
};
