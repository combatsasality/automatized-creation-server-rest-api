interface UserState {
  username: string;
  role: "USER" | "ADMIN";
}

interface UserContext {
  user: UserState;
  setUser: GDispatch<GSetStateAction<UserState>>;
}

interface AuthenticationState {
  isAuthenticated: boolean;
  isAuthenticating: boolean;
}

interface AuthenticationContext {
  auth: AuthenticationState;
  setAuth: GDispatch<GSetStateAction<AuthenticationState>>;
}
