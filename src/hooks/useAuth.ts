import { useState, useCallback } from "react";
import apiClient from "@/config/api";

interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: "politician" | "citizen" | "admin";
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(
    async (email: string, password: string, role: string) => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiClient.post(`/auth/${role}/login`, {
          email,
          password,
        });
        const { token, user: userData } = response.data.data;
        localStorage.setItem("auth_token", token);
        setUser(userData);
        return userData;
      } catch (err: any) {
        const message = err.response?.data?.message || "Login failed";
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const register = useCallback(async (data: any, role: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.post(`/auth/${role}/register`, data);
      const { token, user: userData } = response.data.data;
      localStorage.setItem("auth_token", token);
      setUser(userData);
      return userData;
    } catch (err: any) {
      const message = err.response?.data?.message || "Registration failed";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("auth_token");
    setUser(null);
  }, []);

  return {
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };
}
