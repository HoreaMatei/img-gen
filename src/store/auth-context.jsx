import { createContext, useState, useContext, useEffect } from "react";

const backendPORT =
  import.meta.env.VITE_BACKEND_URL || "https://img-gen-three.vercel.app";

const AuthContext = createContext({
  token: null,
  signup: (email, password) => {},
  login: (email, password) => {},
  logout: () => {},
});

export function useAuthContext() {
  const authCtx = useContext(AuthContext);
  if (!authCtx) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return authCtx;
}

function saveToken(token) {
  localStorage.setItem("token", token);
  localStorage.setItem(
    "tokenExp",
    new Date(Date.now() + 60 * 60 * 1000).toISOString()
  );
}

export function AuthContextProvider({ children }) {
  const [token, setToken] = useState(null);

  // Load token from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedTokenExp = localStorage.getItem("tokenExp");

    if (
      storedToken &&
      storedTokenExp &&
      new Date(storedTokenExp) > new Date()
    ) {
      setToken(storedToken); // Restore token
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("tokenExp");
    }
  }, []);

  async function signup(email, password) {
    const response = await fetch(`${backendPORT}/api/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    });

    const resData = await response.json();
    if (!response.ok) {
      throw new Error(resData.message || "Creating a user failed.");
    }

    setToken(resData.token);
    saveToken(resData.token);
  }

  async function login(email, password) {
    const response = await fetch(`${backendPORT}/api/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    });

    const resData = await response.json();
    if (!response.ok) {
      throw new Error(resData.message || "Logging in failed.");
    }

    setToken(resData.token);
    saveToken(resData.token);
  }

  function logout() {
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("tokenExp");
  }

  const contextValue = {
    token,
    signup,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}
