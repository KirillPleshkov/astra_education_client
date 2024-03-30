import { AxiosInstance } from "axios";

type TypeFetchSkills = {
  id: string;
  name: string;
}[];

function fetchSkills(api: AxiosInstance, name?: string) {
  return api.get<TypeFetchSkills>(
    `${import.meta.env.VITE_BACKEND_URL}skills_products/skill/`,
    { params: { name } }
  );
}

export { fetchSkills };
export type { TypeFetchSkills };
