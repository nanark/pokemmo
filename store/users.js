export const state = () => ({
  me: "",
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
  }
};

export const actions = {
  setUser: function(context, userId) {
    context.commit("SET_USER", userId);
  },
  async getUsers({ commit }) {
    const users = await this.$axios.$get("/users/online");
    commit("SET_USERS", users);
  }
};
