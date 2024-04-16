import { useQuery } from "@tanstack/react-query";
import useAxios from "../services/api";
import { fetchDisciplines } from "../api/Discipline/FetchDisciplines";
import { fetchEducationalLevels } from "../api/Curriculum/FetchEducationalLevels";

const useEducationalLevels = () => {
  const { data } = useQuery({
    queryKey: ["educational_levels"],
    queryFn: () => fetchEducationalLevels(),
    select: ({ data }) => data,
  });

  return { educationalLevels: data };
};

export { useEducationalLevels };
