import { AxiosInstance } from "axios";

type TypeFetchDelete = {
  id: number;
  name: string;
};

function fetchDisciplineDelete(api: AxiosInstance, id: number) {
  return api.delete<TypeFetchDelete>(
    `${import.meta.env.VITE_BACKEND_URL}discipline/${id}`
  );
}

export { fetchDisciplineDelete };
export type { TypeFetchDelete };
