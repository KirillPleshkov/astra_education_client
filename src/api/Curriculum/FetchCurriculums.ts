import { AxiosInstance } from "axios";

type TypeFetchCurriculums = {
  id: number;
  name: string;
};

function fetchCurriculums(api: AxiosInstance, name: string) {
  return api.get<TypeFetchCurriculums>(
    `${import.meta.env.VITE_BACKEND_URL}curriculum/`,
    { params: { name } }
  );
}

export { fetchCurriculums };
export type { TypeFetchCurriculums };
