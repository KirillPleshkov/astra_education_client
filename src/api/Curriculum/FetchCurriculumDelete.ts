import { AxiosInstance } from "axios";

type TypeFetchDelete = {
  id: number;
  name: string;
};

function fetchCurriculumDelete(api: AxiosInstance, id: number) {
  return api.delete<TypeFetchDelete>(
    `${import.meta.env.VITE_BACKEND_URL}curriculum/${id}`
  );
}

export { fetchCurriculumDelete };
export type { TypeFetchDelete };
