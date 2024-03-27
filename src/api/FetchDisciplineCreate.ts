import { AxiosInstance } from "axios";

type TypeFetchCreated = {
  id: number;
  name: string;
};

function fetchDisciplineCreate(api: AxiosInstance, name?: string) {
  return api.post<TypeFetchCreated>(
    `${import.meta.env.VITE_BACKEND_URL}discipline/`,
    { name: name }
  );
}

export { fetchDisciplineCreate };
export type { TypeFetchCreated };
