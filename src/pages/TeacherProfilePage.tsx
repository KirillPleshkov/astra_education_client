import { useQuery } from "@tanstack/react-query";
import * as React from "react";
import useAxios from "../services/api";
import { useParams } from "react-router-dom";
import { fetchTeacher } from "../api/User/FetchTeacher";
import userImg from "../images/user.jpg";

const TeacherProfilePage: React.FunctionComponent = () => {
  const { api } = useAxios();
  const { teacherId } = useParams();

  const { data } = useQuery({
    queryKey: ["teacher", teacherId],
    queryFn: () => fetchTeacher(api, Number(teacherId)),
    select: ({ data }) => data,
  });

  return (
    <div className="mainContent">
      <div className="disciplineName">
        {data?.last_name} {data?.first_name}
      </div>
      <div className="profileContent">
        <div className="profileImageContainer">
          <img src={userImg} />
        </div>
        <div className="profileInfo">
          <div>
            <h2>Контактная информация</h2>
            <label className="profileLabel">Электронная почта:</label>
            <div className="profileText">{data?.email}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherProfilePage;
