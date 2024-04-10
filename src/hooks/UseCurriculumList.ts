import { useQuery } from "@tanstack/react-query";
import useAxios from "../services/api";
import { fetchCurriculums } from "../api/Curriculum/FetchCurriculums";

const useCurriculumList = (name: string) => {
  const { api } = useAxios();

  const { data } = useQuery({
    queryKey: ["curriculumName", name],
    queryFn: () => fetchCurriculums(api, name),
    select: ({ data }) => data,
  });

  return data as { name: string; id: number }[] | undefined;
};

export { useCurriculumList };
