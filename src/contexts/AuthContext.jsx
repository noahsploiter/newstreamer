import React, { createContext, useEffect, useState, useContext } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const storedData = localStorage.getItem("user_data");
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        const { userToken, user } = parsedData;
        setToken(userToken);
        setUserData(user);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Failed to parse user data from local storage", error);
      }
    }
  }, []);

  const login = (newToken, newData) => {
    try {
      localStorage.setItem(
        "user_data",
        JSON.stringify({ userToken: newToken, user: newData })
      );
      setToken(newToken);
      setUserData(newData);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Failed to save user data to local storage", error);
    }
  };

  const logout = () => {
    localStorage.removeItem("user_data");
    setToken(null);
    setUserData(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{ token, isAuthenticated, login, logout, userData }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
