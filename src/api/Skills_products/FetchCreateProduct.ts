import { AxiosInstance } from "axios";

type TypeFetchCreated = {
  id: number;
  name: string;
};

function fetchProductCreate(api: AxiosInstance, name?: string) {
  return api.post<TypeFetchCreated>(
    `${import.meta.env.VITE_BACKEND_URL}skills_products/product/`,
    { name: name }
  );
}

export { fetchProductCreate };
export type { TypeFetchCreated };
