import { createContext, useContext, useEffect, useState } from "react";
import TokenService from "../services/token.service.js";
import api from "../services/api.js";

const API_AUTH_URL = "http://localhost:3000/api/auth";

const AuthContext = createContext(undefined);

export const useAuth = () => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("useAuth must be used within a AuthProvider");
  }

  return authContext;
};

export const AuthProvider = ({ children }) => {
  const [isAuth, setIsAuth] = useState(TokenService.isAccessTokenNotExpired());

  const storedUser = JSON.parse(localStorage.getItem("user"));

  const [user, setUser] = useState(storedUser || null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get(API_AUTH_URL + "/me");
        setUser(response.data);
        localStorage.setItem("user", JSON.stringify(response.data));
        setIsAuth(true);
      } catch (error) {
        console.error("Failed to fetch user", error);
        setUser(null);
        localStorage.removeItem("user");
        setIsAuth(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isAuth,
        setIsAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
