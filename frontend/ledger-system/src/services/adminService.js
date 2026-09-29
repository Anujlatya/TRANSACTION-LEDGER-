import api from "./api";

// Get Admin Dashboard Overview metrics
export const getAdminDashboardMetrics = async () => {
  const response = await api.get("/admin/dashboard");
  return response.data;
};

// Get list of all registered users
export const getAllUsers = async () => {
  const response = await api.get("/admin/users");
  return response.data;
};

// Get accounts of a specific user
export const getUserAccounts = async (userId) => {
  const response = await api.get(`/admin/accounts/${userId}`);
  return response.data;
};

// Get all transactions involving a specific user's accounts
export const getUserTransactions = async (userId) => {
  const response = await api.get(`/admin/transaction/${userId}`);
  return response.data;
};

// Update account status (ACTIVE, FROZEN, CLOSED)
export const updateAccountStatus = async (accountId, accountStatus) => {
  const response = await api.patch(`/admin/account/status/${accountId}`, {
    accountStatus,
  });
  return response.data;
};

// Delete account permanently
export const deleteAccount = async (accountId) => {
  const response = await api.delete(`/admin/account/${accountId}`);
  return response.data;
};

// Update user role (USER, ADMIN)
export const updateUserRole = async (userId, role) => {
  const response = await api.patch(`/admin/user/role/${userId}`, { role });
  return response.data;
};

// Delete user and associated accounts
export const deleteUser = async (userId) => {
  const response = await api.delete(`/admin/user/${userId}`);
  return response.data;
};
