import { AxiosInstance } from "axios";

type TypeFetchProducts = {
  id: string;
  name: string;
}[];

function fetchProducts(api: AxiosInstance, name?: string) {
  return api.get<TypeFetchProducts>(
    `${import.meta.env.VITE_BACKEND_URL}skills_products/product/`,
    { params: { name } }
  );
}

export { fetchProducts };
export type { TypeFetchProducts };
