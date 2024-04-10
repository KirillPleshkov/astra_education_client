import { AxiosInstance } from "axios";

type TypeFetchCreated = {
  id: number;
  name: string;
};

function fetchCurriculumCreate(api: AxiosInstance, name?: string) {
  return api.post<TypeFetchCreated>(
    `${import.meta.env.VITE_BACKEND_URL}curriculum/`,
    {
      name,
      educational_level: {
        name: "Бакалавриат",
      },
      disciplines: [],
    }
  );
}

export { fetchCurriculumCreate };
