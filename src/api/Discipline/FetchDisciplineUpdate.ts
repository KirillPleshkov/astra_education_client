import { AxiosInstance } from "axios";
import { TypeFetchDiscipline } from "./FetchDiscipline";

function fetchDisciplineUpdate(
  api: AxiosInstance,
  discipline: TypeFetchDiscipline
) {
  return api.put<TypeFetchDiscipline>(
    `${import.meta.env.VITE_BACKEND_URL}discipline/${discipline.id}/`,
    discipline
  );
}

export { fetchDisciplineUpdate };
