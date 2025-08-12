import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import AuthService from "../services/auth.service.js";
import TokenService from "../services/token.service.js";
import { useAuth } from "../providers/AuthProvider.jsx";

export default function withAuth(Component, redirectTo = "/login") {
  return function AuthenticatedComponent(props) {
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
      if (!user) {
        navigate(redirectTo, { replace: true });
      }
    }, [user, navigate]);

    return user ? <Component {...props} /> : null;
  };
}
