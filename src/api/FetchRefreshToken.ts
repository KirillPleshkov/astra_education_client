import axios from "axios";

type TypeFetchRefreshToken = {
  access: string;
};

function fetchRefreshToken({ refresh }: { refresh: string | null }) {
  return axios.post<TypeFetchRefreshToken>(
    `${import.meta.env.VITE_BACKEND_URL}token/refresh/`,
    { refresh }
  );
}

export { fetchRefreshToken };
export type { TypeFetchRefreshToken };
