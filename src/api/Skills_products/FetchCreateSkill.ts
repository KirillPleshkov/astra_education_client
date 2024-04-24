import { AxiosInstance } from "axios";

type TypeFetchCreated = {
  id: number;
  name: string;
};

function fetchSkillCreate(api: AxiosInstance, name?: string) {
  return api.post<TypeFetchCreated>(
    `${import.meta.env.VITE_BACKEND_URL}skills_products/skill/`,
    { name: name }
  );
}

export { fetchSkillCreate };
export type { TypeFetchCreated };
