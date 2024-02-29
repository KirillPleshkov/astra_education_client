import { AxiosInstance } from "axios";

type TypeFetchModule = {
  id: string;
  name: string;
  blocks: {
    id: number;
    name: string;
    main_text: string;
    position: number;
    files: {
      id: number;
      file: string;
      position: number;
    }[];
  }[];
};

function fetchModule(api: AxiosInstance, moduleId?: string) {
  return api.get<TypeFetchModule>(
    `${import.meta.env.VITE_BACKEND_URL}module/${moduleId}`
  );
}

export { fetchModule };
export type { TypeFetchModule };
