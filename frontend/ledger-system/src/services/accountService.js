import api from "./api";

export const createAccount = () => {
  return api.post("/account");
};

export const getAccounts = () => {
  return api.get("/account");
};

export const getAccountBalance = (accountId) => {
  return api.get(`/account/balance/${accountId}`);
};

export const searchAccount = (accountNumber) => {
  return api.get(`/account/search/${accountNumber}`);
};

export const getCurrentUser = () => {
  return api.get("/auth/me");
};