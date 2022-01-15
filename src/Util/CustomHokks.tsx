import { useEffect, useState } from "react";

import { fetchDataAuth } from "./dataService";

export const useFetch = <T extends any>(url: string) => {
  const [data, setData] = useState<Array<T>>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const fetechData = async (url: string) => {
    const apiData = await fetchDataAuth(url);
    setData(apiData);
  };
  useEffect(() => {
    fetechData(url);
    setLoading(false);
  }, []);
  return [data, loading, fetechData] as const;
};
