export default $axios => {
  index() {
    return $axios.$get("/posts");
  },

  create(payload) {
    return $axios.$post(`/posts`, payload);
  },

  show(id) {
    return $axios.$get(`/posts/${id}`);
  },

  update(payload) {
    return $axios.$put(`/posts`, payload);
  },

  delete(id) {
    return $axios.$delete(`/posts/${id}`);
  }
};
