import { useQuery } from "@tanstack/react-query";
import useAxios from "../services/api";
import { fetchProducts } from "../api/Skills_products/FetchProducts";

const useProductList = (name: string) => {
  const { api } = useAxios();

  const { data } = useQuery({
    queryKey: ["productName", name],
    queryFn: () => fetchProducts(api, name),
    select: ({ data }) => data,
  });

  return data as { name: string; id: number }[] | undefined;
};

export { useProductList };
