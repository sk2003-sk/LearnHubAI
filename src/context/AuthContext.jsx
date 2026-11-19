import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import AuthContext from "./auth-context";
import {
  activateUser,
  getCurrentUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  socialAuthUser,
} from "../features/auth/api/auth.api";
import {
  clearAccessToken,
  setAccessToken,
  shouldRememberSession,
} from "../services/storage/tokenStorage";
import { extractObject } from "../utils/apiResponse";

const getUser = (response) => extractObject(response, ["user"]);

const getToken = (response) => {
  let value = response;
  const visited = new Set();

  while (
    value &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    !visited.has(value)
  ) {
    visited.add(value);
    if (typeof value.accessToken === "string") return value.accessToken;
    if (typeof value.token === "string") return value.token;
    value = value.data ?? value.result ?? value.payload ?? null;
  }

  return null;
};

export function AuthProvider({ children }) {
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  const initialized = useRef(false);

  const checkAuth = useCallback(async () => {
    setIsLoading(true);
    setAuthError(null);

    try {
      const refreshResponse = await refreshAccessToken();
      const refreshedToken = getToken(refreshResponse);

      if (refreshedToken) {
        setAccessToken(refreshedToken, shouldRememberSession());
      }

      const response = await getCurrentUser();
      const currentUser = getUser(response);
      setUser(currentUser);
      return currentUser;
    } catch (error) {
      if (![400, 401].includes(error.status)) {
        setUser(null);
        setAuthError(error.message || "Unable to verify your session.");
        return null;
      }

      clearAccessToken();
      setUser(null);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    checkAuth();
  }, [checkAuth]);

  const login = useCallback(
    async (credentials, remember = false) => {
      setAuthError(null);
      const response = await loginUser(credentials);
      queryClient.clear();
      const accessToken = getToken(response);

      if (accessToken) {
        setAccessToken(accessToken, remember);
      }

      let authenticatedUser = getUser(response);

      if (!authenticatedUser) {
        const currentUserResponse = await getCurrentUser();
        authenticatedUser = getUser(currentUserResponse);
      }

      setUser(authenticatedUser);
      return response;
    },
    [queryClient],
  );

  const register = useCallback(
    async (userData) => {
      setAuthError(null);
      const response = await registerUser(userData);

      const accessToken = getToken(response);
      if (accessToken) {
        setAccessToken(accessToken);
        queryClient.clear();
        setUser(getUser(response));
      }

      return response;
    },
    [queryClient],
  );

  const activate = useCallback(async (activationData) => {
    setAuthError(null);
    return activateUser(activationData);
  }, []);

  const socialLogin = useCallback(
    async (userData) => {
      setAuthError(null);
      const response = await socialAuthUser(userData);
      queryClient.clear();
      const accessToken = getToken(response);

      if (accessToken) setAccessToken(accessToken, true);

      setUser(getUser(response));
      return response;
    },
    [queryClient],
  );

  const logout = useCallback(async () => {
    try {
      await logoutUser();
    } finally {
      clearAccessToken();
      queryClient.clear();
      setUser(null);
      setAuthError(null);
    }
  }, [queryClient]);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoading,
      authError,
      login,
      register,
      activate,
      socialLogin,
      logout,
      checkAuth,
      refetchUser: checkAuth,
      setUser,
    }),
    [
      user,
      isLoading,
      authError,
      login,
      register,
      activate,
      socialLogin,
      logout,
      checkAuth,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
