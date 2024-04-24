import { AxiosInstance } from "axios";

type TypeFetchModules = {
  id: string;
  name: string;
}[];

function fetchModules(api: AxiosInstance, name?: string) {
  return api.get<TypeFetchModules>(
    `${import.meta.env.VITE_BACKEND_URL}module/`,
    { params: { name } }
  );
}

export { fetchModules };
export type { TypeFetchModules };
