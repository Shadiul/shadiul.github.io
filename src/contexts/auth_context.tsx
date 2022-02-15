import React, { createContext, FC, useContext, useState } from "react";

export function useAuth() {
  return useContext(AuthContext);
}

interface AuthInterface {
  isLoggedIn: boolean;
  login: () => Promise<any>;
  logout: () => Promise<any>;
}

export const AuthContext = createContext({} as AuthInterface);

type Props = {};

const AuthContextProvider: FC = ({ children }) => {
  const [isLogggedIn, setIsLogggedIn] = useState(true);

  const login = () => {
    setIsLogggedIn(true);
    return Promise.resolve("success");
    // return Promise.reject("error");
  };
  const logout = () => {
    setIsLogggedIn(false);
    return Promise.resolve("success");
    // return Promise.reject("error");
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn: isLogggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
