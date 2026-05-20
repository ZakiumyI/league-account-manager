import axios from "axios";

const API = "http://localhost:3000";

export const getAccounts = () =>
  axios.get(`${API}/accounts`);

export const createAccount = (data) =>
  axios.post(`${API}/accounts`, data);

export const refreshAccount = (id) =>
  axios.put(`${API}/accounts/${id}/refresh`);

export const deleteAccount = (id) =>
  axios.delete(`${API}/accounts/${id}`);