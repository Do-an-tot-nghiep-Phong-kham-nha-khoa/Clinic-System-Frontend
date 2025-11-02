import React, { createContext, useState, useEffect, useContext } from "react";
import Cookies from "js-cookie";
import jwtDecode from "jwt-decode";

interface DecodedToken {
  id: string;
  email: string;
  role?: string;
  exp: number;
  iat: number;
}

interface User {
  id: string;
  email: string;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = Cookies.get("tokenUser");
    if (token) {
      try {
        const decoded: DecodedToken = jwtDecode(token);

        // Kiểm tra hết hạn
        if (decoded.exp * 1000 < Date.now()) {
          Cookies.remove("tokenUser");
          setUser(null);
        } else {
          setUser({
            id: decoded.id,
            email: decoded.email,
            role: decoded.role,
          });
        }
      } catch (err) {
        console.error("Invalid token:", err);
        Cookies.remove("tokenUser");
      }
    }
  }, []);

  const logout = () => {
    Cookies.remove("tokenUser");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
