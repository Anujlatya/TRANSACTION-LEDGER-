import api from "./api";

export const transferMoney = (data) => {
  return api.post("/transaction", data);
};

export const getTransactions = () => {
  return api.get("/transaction");
};

export const getLedgerHistory = () => {
    return api.get("/transaction/ledger");

};