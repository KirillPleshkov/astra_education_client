import { AxiosInstance } from "axios";

type TypeFetchDisciplines = {
  id: string;
  name: string;
}[];

function fetchDisciplines(api: AxiosInstance, name?: string) {
  return api.get<TypeFetchDisciplines>(
    `${import.meta.env.VITE_BACKEND_URL}discipline/`,
    { params: { name } }
  );
}

export { fetchDisciplines };
export type { TypeFetchDisciplines };
