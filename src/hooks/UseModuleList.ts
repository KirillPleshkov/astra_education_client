import { useQuery } from "@tanstack/react-query";
import { fetchModules } from "../api/Module/FetchModules";
import useAxios from "../services/api";

const useModuleList = (name: string) => {
  const { api } = useAxios();

  const { data } = useQuery({
    queryKey: ["moduleName", name],
    queryFn: () => fetchModules(api, name),
    select: ({ data }) => data,
  });

  return data as { name: string; id: number }[] | undefined;
};

export { useModuleList };
