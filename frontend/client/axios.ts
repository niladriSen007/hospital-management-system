import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";

export const client = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

client.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // In browser, try to get token from localStorage or cookies
    if (typeof window !== 'undefined') {
      const accessToken = localStorage.getItem('accessToken');
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);


const callRefresh = async () => {
  const { data } = await client.post(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/core/refresh-token`,
    {},
    {
      withCredentials: true,
    }
  );
  return {
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
  }
};

client.interceptors.response.use(
  (res: AxiosResponse) => {
    return res; // Simply return the response
  },
  async (err) => {

    const originalRequest = err.config;

    const status = err.response ? err.response.status : null;

    if (status === 401 && !originalRequest._isRetry) {
      try {
        originalRequest._isRetry = true;
        const headers = { ...originalRequest.headers };
        /* const refreshTokenFromStorage = (await cookies()).get("refreshToken")?.value; */

        //call the /refresh-token endpoint to get new tokens
        const { accessToken, refreshToken } = await callRefresh();


        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);

        return client.request({ ...originalRequest, headers })
      } catch (error) {
        console.error('Token refresh error', err);
        return Promise.reject(error);
      }
    }

    if (status === 403 && err.response.data) {
      return Promise.reject(err.response.data);
    }

    return Promise.reject(err);
  }
);