import { useEffect, useState } from "react";

import { fetchDataAuth } from "./dataService";

export const useFetch = <T extends object>(
  url: string,
  partData: T | undefined = undefined
) => {
  const [data, setData] = useState<Array<T>>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const fetechData = async (url: string) => {
    const apiData: Array<T> = await fetchDataAuth(url);
    if (partData) {
      const newApiData = apiData.map((value) => {
        return { ...value, ...partData };
      });
      setData(newApiData);
    } else {
      setData(apiData);
    }
  };
  useEffect(() => {
    fetechData(url);
    setLoading(false);
  }, []);
  //if data is thier set it setData
  return [data, loading, fetechData, setData] as const;
};
