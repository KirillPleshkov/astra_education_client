import { AxiosInstance } from "axios";

type TypeFetchTeachers = {
  id: number;
  first_name: string;
  last_name: string;
}[];

function fetchTeachers(api: AxiosInstance, name?: string) {
  return api.get<TypeFetchTeachers>(
    `${import.meta.env.VITE_BACKEND_URL}user/teacher`,
    { params: { name } }
  );
}

export { fetchTeachers };
export type { TypeFetchTeachers };
