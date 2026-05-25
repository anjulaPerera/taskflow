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


interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  loading: boolean;
}


const AuthContext = createContext<AuthContextType | undefined>(undefined);


export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setTokenState] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const savedToken = getToken();
    if (savedToken) {
      // In reality we should verify the token with the backend here
      // For now, we trust the locally stored token
      //lets see to it later (further dev)
      setTokenState(savedToken);
      const savedUser = localStorage.getItem("taskflow_user");
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    }
    setLoading(false);
  }, []); 

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

// Instead of writing useContext(AuthContext) everywhere,
// components just call useAuth()
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
