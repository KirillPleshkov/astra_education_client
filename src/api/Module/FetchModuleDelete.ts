import { AxiosInstance } from "axios";

function fetchModuleDelete(api: AxiosInstance, moduleId?: number) {
  return api.delete(`${import.meta.env.VITE_BACKEND_URL}module/${moduleId}`);
}

export { fetchModuleDelete };
