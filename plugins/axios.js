export default function({ $axios, store }) {
  $axios.onRequest(config => {
    const jwt = store.state.authentication.jwt;
    if (jwt) config.headers.common["Authorization"] = `Bearer ${jwt}`;
  });

  $axios.onError(error => {
    // Refresh token
    if (error.response.status === 401) {
      store.dispatch("authentication/refreshToken").then(() => {
        const config = error.config;
        const jwt = store.state.authentication.jwt;

        config.headers["Authorization"] = `Bearer ${jwt}`;
        return $axios.request(config);
      });
    }
  });
}
