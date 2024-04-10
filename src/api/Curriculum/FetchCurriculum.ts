import { AxiosInstance } from "axios";

type TypeFetchCurriculum = {
  name: string;
  disciplines: {
    discipline: {
      id: number;
      name: string;
    };
    semester: number;
    teachers: {
      user: {
        id: number;
        first_name: string;
        last_name: string;
      };
    }[];
  }[];
  educational_level: {
    id: number;
    name: string;
    study_period: number;
  };
};

function fetchCurriculum(api: AxiosInstance, curriculumId?: number) {
  return api.get<TypeFetchCurriculum>(
    `${import.meta.env.VITE_BACKEND_URL}curriculum/${curriculumId}`
  );
}

export { fetchCurriculum };
export type { TypeFetchCurriculum };
