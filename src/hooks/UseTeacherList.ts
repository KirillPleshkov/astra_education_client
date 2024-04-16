import { useQuery } from "@tanstack/react-query";
import useAxios from "../services/api";
import { fetchTeachers } from "../api/User/FetchTeachers";

const useTeacherList = (name: string) => {
  const { api } = useAxios();

  const { data } = useQuery({
    queryKey: ["teacherName", name],
    queryFn: () => fetchTeachers(api, name),
    select: ({ data }) => data,
  });

  if (!data) return undefined;

  return data.map((e) => {
    return { id: e.id, name: `${e.first_name} ${e.last_name}` };
  }) as { name: string; id: number }[] | undefined;
};

export { useTeacherList };
