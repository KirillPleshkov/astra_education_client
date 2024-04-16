import { AxiosInstance } from "axios";

type TypeFetchTeacher = {
  id: number;
  first_name: string;
  last_name: string;
};

function fetchTeacher(api: AxiosInstance, id: number) {
  return api.get<TypeFetchTeacher>(
    `${import.meta.env.VITE_BACKEND_URL}user/teacher/${id}`
  );
}

export { fetchTeacher };
export type { TypeFetchTeacher };
