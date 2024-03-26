import { AxiosInstance } from "axios";

type TypeFetchDiscipline = {
  name: string;
  short_description: string;
  skills: {
    pk: number;
    name: string;
  }[];
  products: {
    pk: number;
    name: string;
  }[];
  modules: {
    module: {
      pk: number;
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
