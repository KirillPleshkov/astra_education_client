import { AxiosInstance } from "axios";
import { TypeFetchModule } from "./FetchModule";

function fetchUpdateModule(
  api: AxiosInstance,
  module?: TypeFetchModule,
  moduleId?: string
) {
  return api.put<TypeFetchModule>(
    `${import.meta.env.VITE_BACKEND_URL}module/${moduleId}/`,
    { ...module }
  );
}

export { fetchUpdateModule };
export type { TypeFetchModule };
