import { AxiosInstance } from "axios";

type TypeFetchCreated = {
  id: number;
  name: string;
};

function fetchModuleCreate(api: AxiosInstance, name?: string) {
  return api.post<TypeFetchCreated>(
    `${import.meta.env.VITE_BACKEND_URL}module/`,
    { name: name, blocks: [] }
  );
}

export { fetchModuleCreate };
export type { TypeFetchCreated };
