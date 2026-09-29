import { createContext, useContext, useState, useEffect } from "react";
import { getCurrentUser } from "../services/accountService";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Login
  const login = (userData) => {
    const userObj = userData?.user || userData;
    setUser(userObj);
    return userObj;
  };

  // Logout
  const logout = () => {
    setUser(null);
  };

  // GET me 
  const checkAuth = async () => {
    try {
      const res = await getCurrentUser();
      const userObj = res.data.data?.user || res.data.user;
      setUser(userObj || null);
      return userObj;
    } catch (error) {
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Custom Hook
export function useAuth() {
  return useContext(AuthContext);
}