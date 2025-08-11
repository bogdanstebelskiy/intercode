import api from "./api";
import TokenService from "./token.service";

const signup = (username, password) => {
  return api
    .post("/auth/signup", {
      userName: username,
      password,
    })
    .catch((error) => {
      console.error(error);
      return null;
    });
};

const login = (username, password) => {
  return api
    .post("/auth/login", {
      userName: username,
      password,
    })
    .then((response) => {
      if (response.data.accessToken) {
        TokenService.updateLocalAccessToken(response.data.accessToken);
      }

      return response.data.userId;
    })
    .catch((error) => {
      console.error(error);
      return null;
    });
};

const signout = () => {
  TokenService.removeLocalAccessToken();
  TokenService.removeLocalRefreshToken();
};

const AuthService = {
  signup,
  login,
  signout,
};

export default AuthService;
