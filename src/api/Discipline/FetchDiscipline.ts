import { AxiosInstance } from "axios";

type TypeFetchDiscipline = {
  id: number;
  name: string;
  short_description: string;
  skills: {
    id: number;
    name: string;
  }[];
  products: {
    id: number;
    name: string;
  }[];
  modules: {
    module: {
      id: number;
      name: string;
    };
    position: number;
  }[];
};

function fetchDiscipline(api: AxiosInstance, disciplineId?: string) {
  return api.get<TypeFetchDiscipline>(
    `${import.meta.env.VITE_BACKEND_URL}discipline/${disciplineId}`
  );
}

export { fetchDiscipline };
export type { TypeFetchDiscipline };
