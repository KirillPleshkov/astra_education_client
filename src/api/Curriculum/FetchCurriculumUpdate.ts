import { AxiosInstance } from "axios";
import { TypeFetchCurriculum } from "./FetchCurriculum";

function fetchCurriculumUpdate(
  api: AxiosInstance,
  curriculum: TypeFetchCurriculum
) {
  return api.put<TypeFetchCurriculum>(
    `${import.meta.env.VITE_BACKEND_URL}curriculum/${curriculum.id}/`,
    curriculum
  );
}

export { fetchCurriculumUpdate };
