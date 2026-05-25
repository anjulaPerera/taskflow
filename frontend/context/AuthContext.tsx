"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { User } from "@/types";
import { getToken, setToken, removeToken } from "@/lib/api";

// Define the shape of what our context provides
interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  loading: boolean;
}

// Create the context with undefined as default
// Components must be wrapped in AuthProvider to use this
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// The Provider component wraps your entire app
// Everything inside it can access the auth state
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setTokenState] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // On app load, check if there's a saved token in localStorage
  // This is how the user stays "logged in" after refreshing the page
  useEffect(() => {
    const savedToken = getToken();
    if (savedToken) {
      // TODO: In a real app you'd verify the token with the backend here
      // For now, we trust the locally stored token
      setTokenState(savedToken);
      const savedUser = localStorage.getItem("taskflow_user");
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    }
    setLoading(false);
  }, []); // Empty array = run once when the component mounts

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    localStorage.setItem("taskflow_user", JSON.stringify(newUser));
    setTokenState(newToken);
    setUser(newUser);
  };

  const logout = () => {
    removeToken();
    localStorage.removeItem("taskflow_user");
    setTokenState(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook — this is the clean way to consume context
// Instead of writing useContext(AuthContext) everywhere,
// components just call useAuth()
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
