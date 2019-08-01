import axios from "axios";

const _baseUrl = "https://api.zeapps.eu";

export const sendPositionBeacon = payload => {
  return axios.post(`${_baseUrl}/positions/beacon`, payload, _headers());
};

export const getUser = uuid => {
  return axios.get(`${_baseUrl}/user/info/${uuid}`, _headers());
};

const _headers = () => {
  const jwt = window.sessionStorage.getItem("jwt");
  return { headers: { Authorization: `Bearer ${jwt}` } };
};
