import axios from "axios";

const baseUrl = "https://api.zeapps.eu";

const _headers = () => {
  const jwt = window.sessionStorage.getItem("jwt");
  return { headers: { Authorization: `Bearer ${jwt}` } };
};

export const sendPositionBeacon = payload => {
  return axios.post(`${baseUrl}/positions/beacon`, payload, _headers());
};
