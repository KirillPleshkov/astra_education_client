import { AxiosInstance } from "axios";

type TypeFetchDisciplineTeachers = {
  id: number;
  first_name: string;
  last_name: string;
}[];

function fetchDisciplineTeachers(
  api: AxiosInstance,
  curriculum?: string | null,
  discipline?: string | null
) {
  return api.get<TypeFetchDisciplineTeachers>(
    `${import.meta.env.VITE_BACKEND_URL}user/teacher`,
    { params: { curriculum, discipline } }
  );
}

export { fetchDisciplineTeachers };
export type { TypeFetchDisciplineTeachers };
