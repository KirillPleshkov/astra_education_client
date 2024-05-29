import * as React from "react";
import { userContext } from "../contexts/UserContext";
import { useContext } from "react";
import "./styles.css";
import userImg from "../images/user.jpg";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchUser } from "../api/User/FetchUser";
import useAxios from "../services/api";

const ProfilePage: React.FunctionComponent = () => {
  const { user, logout } = useContext(userContext);

  const { api } = useAxios();

  const { data } = useQuery({
    queryKey: ["profile"],
    queryFn: () => fetchUser(api),
    select: ({ data }) => data,
  });

  const navigate = useNavigate();

  return (
    <div className="mainContent">
      <div className="disciplineName">
        {user?.last_name} {user?.first_name}
      </div>
      <div className="profileContent">
        <div className="profileImageContainer">
          <img src={userImg} />
        </div>
        <div className="profileInfo">
          <div>
            <h2>Контактная информация</h2>
            <label className="profileLabel">Электронная почта:</label>
            <div className="profileText">{user?.email}</div>
          </div>

          <div>
            <h2>Дополнительная информация</h2>
            <label className="profileLabel">Роль:</label>
            <div className="profileText" style={{ marginBottom: "20px" }}>
              {user?.role[0]}
            </div>

            <label className="profileLabel">Лингвистические роли:</label>
            {user?.linguist_roles.map((role, index) => (
              <div key={index} className="profileText">
                {role[0]}
              </div>
            ))}
            {!user && <>отсутствуют</>}
          </div>

          <button
            className="profileLogoutButton"
            onClick={() => {
              logout();
              navigate("/");
            }}
          >
            Выйти из профиля
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
