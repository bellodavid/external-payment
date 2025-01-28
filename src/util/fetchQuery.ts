import axios, { AxiosRequestConfig, Method } from "axios";

type FetchDataFunction = <T>(
  url: string,
  method?: Method,
  data?: any
) => Promise<T>;

export const fetchData: FetchDataFunction = async <T>(
  url: string,
  method: Method = "GET",
  data: any = null
): Promise<T> => {
  try {
    const options: AxiosRequestConfig = {
      method,
      url,
      ...(method === "POST" && { data }),
    };

    const response = await axios(options);
    return response.data as T;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};
