import api from "./api";
import TokenService from "./token.service";

const signup = (username, password, avatar) => {
  return api
    .post("/auth/signup", {
      userName: username,
      password,
      avatar,
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

      if (response.data.user) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }

      return response.data.user;
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
