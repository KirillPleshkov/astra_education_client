import { AxiosInstance } from "axios";

type TypeFetchModuleCreate = {
  id: number;
  name: string;
};

function fetchModuleCreate(api: AxiosInstance, name?: string) {
  return api.post<TypeFetchModuleCreate>(
    `${import.meta.env.VITE_BACKEND_URL}module/`,
    { name: name, blocks: [] }
  );
}

export { fetchModuleCreate };
export type { TypeFetchModuleCreate };
