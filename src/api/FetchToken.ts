import axios from "axios";

type TypeFetchToken = {
  access: string;
  refresh: string;
};

function fetchToken({
  email,
  password,
}: {
  email?: string;
  password?: string;
}) {
  return axios.post<TypeFetchToken>(
    `${import.meta.env.VITE_BACKEND_URL}token/`,
    { email, password }
  );
}

export { fetchToken };
export type { TypeFetchToken };
