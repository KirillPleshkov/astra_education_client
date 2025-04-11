import * as React from "react";
import "./styles.css";
import { Link, useParams, useSearchParams } from "react-router-dom";
import useAxios from "../../services/api";
import { useQuery } from "@tanstack/react-query";
import { fetchDisciplineTeachers } from "../../api/User/FetchDisciplineTeachers";

interface IDescriptionModuleProps {
  short_description: string;
  skills: {
    id: number;
    name: string;
  }[];
  products: {
    id: number;
    name: string;
  }[];
}

const DescriptionModule: React.FunctionComponent<IDescriptionModuleProps> = ({
  short_description,
  skills,
  products,
}) => {
  const [searchParams] = useSearchParams();
  const { disciplineId } = useParams();

  const { api } = useAxios();

  const { data } = useQuery({
    queryKey: [
      "teachers_discipline",
      disciplineId,
      searchParams.get("curriculum"),
    ],
    queryFn: () =>
      fetchDisciplineTeachers(
        api,
        searchParams.get("curriculum"),
        disciplineId
      ),
    select: ({ data }) => data,
    enabled: !!disciplineId && !!searchParams.get("curriculum"),
  });

  return (
    <div className="module">
      <div className="moduleBlock">
        <div className="moduleBlockTitle">Описание</div>
        <div className="moduleBlockMainText">
          {short_description ? short_description : "Нет описания"}
        </div>
      </div>

      {searchParams.get("curriculum") && (
        <div className="moduleBlock">
          <div className="moduleBlockTitle">Преподаватели</div>
          <div className="moduleBlockMainText">
            {data &&
              data.map((elem) => (
                <div className="textBlock" key={elem.id}>
                  <Link to={`/teacher/${elem.id}`}>
                    {elem.last_name} {elem.first_name}
                  </Link>
                </div>
              ))}
            {!data?.length && <>Преподавателей нет</>}
          </div>
        </div>
      )}

      <div className="moduleBlock">
        <div className="moduleBlockTitle">Компетенци</div>
        <div className="moduleBlockMainText">
          {skills.map((elem) => (
            <div className="textBlock" key={elem.id}>
              {elem.name}
            </div>
          ))}
          {!skills.length && <>Навыков нет</>}
        </div>
      </div>

      <div className="moduleBlock">
        <div className="moduleBlockTitle">Продукты ПАО Группы Астра</div>
        <div className="moduleBlockMainText">
          {products.map((elem) => (
            <div className="textBlock" key={elem.id}>
              {elem.name}
            </div>
          ))}
          {!products.length && <>Продуктов нет</>}
        </div>
      </div>
    </div>
  );
};

export default DescriptionModule;
