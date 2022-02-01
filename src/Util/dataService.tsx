import { LocalDataStorage } from "./Others";

// Fetech data
export async function sendData(input: RequestInfo, init?: RequestInit) {
  try {
    const response = await fetch(input, init);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  } catch (e) {
    throw new Error(`Something is really wrong${e}`);
  }
}

// in case of get when auth is thier
export async function fetchDataAuth(
  url: string,
  header: HeadersInit = {
    "Content-Type": "application/json",
    Authorization: LocalDataStorage.getTokenFromCookie(`accessToken`) as string,
  }
) {
  try {
    const response = await fetch(url, {
      method: "GET",
      mode: "cors",
      headers: header,
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  } catch (e) {
    throw new Error(`Something is really wrong${e}`);
  }
}

// in case of get when auth is thier is some some
export async function fetchDataAuthByData<T>(url: string, value: string) {
  try {
    const header: HeadersInit = {
      "Content-Type": "application/json",
      Authorization: LocalDataStorage.getTokenFromCookie(
        `accessToken`
      ) as string,
      data: value, //id name or anything just a string
    };
    const response = await fetch(url, {
      method: "GET",
      mode: "cors",
      headers: header,
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  } catch (e) {
    throw new Error(`Something is really wrong${e}`);
  }
}
