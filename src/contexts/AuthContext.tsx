import React, {
  PropsWithChildren,
  createContext,
  useEffect,
  useState,
} from "react";
import { fetchRefreshToken } from "../api/FetchRefreshToken";
import { useNavigate } from "react-router-dom";

export const authContext = createContext({});

interface HeaderProps {
  children: unknown;
}

const AuthProvider: React.FC<PropsWithChildren<HeaderProps>> = ({
  children,
}) => {
  const [auth, setAuth] = useState({
    accessToken: "",
    refreshToken: localStorage.getItem("refreshToken") || "",
  });

  const navigate = useNavigate();

  const setAuthData = (accessToken: string, refreshToken: string) => {
    setAuth({ accessToken, refreshToken });
    localStorage.setItem("refreshToken", refreshToken);
  };

  useEffect(() => {
    fetchRefreshToken({ refresh: auth.refreshToken })
      .then(({ data }) => {
        setAuth({ accessToken: data.access, refreshToken: auth.refreshToken });
      })
      .catch(() => {
        setAuth({ accessToken: "", refreshToken: "" });
        localStorage.setItem("refreshToken", "");
        navigate("/login");
      });
  }, []);

  console.log(auth);

  return (
    <authContext.Provider value={{ auth, setAuthData }}>
      {children}
    </authContext.Provider>
  );
};

export default AuthProvider;
