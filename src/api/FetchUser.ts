import { AxiosInstance } from "axios";

type typeFetchUser = {
  email: string;
  first_name: string;
  last_name: string;
  role: [string, string];
  linguist_roles: [string, string][];
};

function fetchUser(api: AxiosInstance) {
  return api.get<typeFetchUser>(`${import.meta.env.VITE_BACKEND_URL}user/`);
}

export { fetchUser };

export type { typeFetchUser };
