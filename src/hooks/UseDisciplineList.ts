import { useQuery } from "@tanstack/react-query";
import useAxios from "../services/api";
import { fetchDisciplines } from "../api/FetchDisciplines";

const useDisciplineList = (name: string) => {
  const { api } = useAxios();

  const { data } = useQuery({
    queryKey: ["disciplineName", name],
    queryFn: () => fetchDisciplines(api, name),
    select: ({ data }) => data,
  });

  return data as { name: string; id: number }[] | undefined;
};

export { useDisciplineList };
