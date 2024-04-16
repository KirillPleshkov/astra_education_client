import React, {
  PropsWithChildren,
  createContext,
  useEffect,
  useState,
} from "react";
import { fetchRefreshToken } from "../api/FetchRefreshToken";
// import { useNavigate } from "react-router-dom";
import useAxios from "../services/api";
import { fetchUser, typeFetchUser } from "../api/User/FetchUser";

type TypeUserContext = {
  user: typeFetchUser | null;
  updateUserInfo: () => void;
  logout: () => void;
};

export const userContext = createContext<TypeUserContext>({
  user: null,
  updateUserInfo: () => void 0,
  logout: () => void 0,
});

interface HeaderProps {
  children: unknown;
}

const UserProvider: React.FC<PropsWithChildren<HeaderProps>> = ({
  children,
}) => {
  const [user, setUser] = useState<TypeUserContext["user"]>(null);

  // const navigator = useNavigate();

  const { api } = useAxios();

  const updateUserInfo: TypeUserContext["updateUserInfo"] = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      const response = await fetchRefreshToken({ refresh: refreshToken });
      const { access } = response.data;

      localStorage.setItem("accessToken", access);

      setUser((await fetchUser(api)).data);
    } catch (error) {
      // const refreshToken = localStorage.getItem("refreshToken");
      localStorage.setItem("refreshToken", "");
      localStorage.setItem("accessToken", "");

      // if (refreshToken?.length) {
      //   navigator("/login");
      // }
    }
  };

  const logout: TypeUserContext["logout"] = () => {
    localStorage.setItem("refreshToken", "");
    localStorage.setItem("accessToken", "");
    setUser(null);
  };

  useEffect(() => {
    updateUserInfo();
  }, []);

  return (
    <userContext.Provider value={{ user, updateUserInfo, logout }}>
      {children}
    </userContext.Provider>
  );
};

export default UserProvider;

export type { TypeUserContext };
