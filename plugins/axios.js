export default function({ $axios, store }) {
  $axios.onRequest(config => {
    const jwt = store.state.authentication.jwt;
    if (jwt) config.headers.common["Authorization"] = `Bearer ${jwt}`;
  });
}
