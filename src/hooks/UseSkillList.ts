import { useQuery } from "@tanstack/react-query";
import useAxios from "../services/api";
import { fetchSkills } from "../api/FetchSkills";

const useSkillList = (name: string) => {
  const { api } = useAxios();

  const { data } = useQuery({
    queryKey: ["skillName", name],
    queryFn: () => fetchSkills(api, name),
    select: ({ data }) => data,
  });

  return data as { name: string; id: number }[] | undefined;
};

export { useSkillList };
