import { AxiosInstance } from "axios";

type TypeFetchCurriculumsTeacher = {
  id: number;
  semester: number;
  curriculum: {
    id: number;
    name: string;
  };
  discipline: {
    id: number;
    name: string;
  };
  users: {
    id: number;
    first_name: string;
    last_name: string;
  }[];
}[];

function fetchCurriculumsTeacher(api: AxiosInstance) {
  return api.get<TypeFetchCurriculumsTeacher>(
    `${import.meta.env.VITE_BACKEND_URL}curriculum/`,
    { params: { teacher: true } }
  );
}

export { fetchCurriculumsTeacher };
export type { TypeFetchCurriculumsTeacher };
