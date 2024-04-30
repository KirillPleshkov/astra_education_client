import { AxiosInstance } from "axios";

type TypeFetchFileUpload = {
  id: number;
  file: string;
  position: number;
  block: number;
};

function fetchFileUpload(api: AxiosInstance, file: FormData) {
  return api.post<TypeFetchFileUpload>(
    `${import.meta.env.VITE_BACKEND_URL}block/file/upload`,
    file
  );
}

export { fetchFileUpload };
export type { TypeFetchFileUpload };
