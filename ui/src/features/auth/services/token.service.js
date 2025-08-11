import api from "./api.js";

const getLocalAccessToken = () => {
  return localStorage.getItem("accessToken");
};

const removeLocalAccessToken = () => {
  return localStorage.removeItem("accessToken");
};

const updateLocalAccessToken = (accessToken) => {
  localStorage.setItem("accessToken", accessToken);
};

const removeLocalRefreshToken = () => {
  return api.post("/auth/logout");
};

const isAccessTokenNotExpired = () => {
  const accessToken = TokenService.getLocalAccessToken();
  return accessToken != null && !TokenService.isTokenExpired(accessToken);
};

const isTokenExpired = (token) => {
  if (!token) return true;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const expiry = payload.exp;
    if (!expiry) return true;

    return Date.now() >= expiry * 1000;
  } catch {
    return true;
  }
};

const TokenService = {
  getLocalAccessToken,
  updateLocalAccessToken,
  removeLocalAccessToken,
  removeLocalRefreshToken,
  isAccessTokenNotExpired,
  isTokenExpired,
};

export default TokenService;
