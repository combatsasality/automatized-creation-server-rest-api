import { createContext } from "react";

export const UserContext = createContext<UserContext>({
  user: { username: null, role: "USER" },
  setUser: () => {},
});

export const AuthenticationContext = createContext<AuthenticationContext>({
  auth: { isAuthenticated: false, isAuthenticating: true },
  setAuth: () => {},
});
