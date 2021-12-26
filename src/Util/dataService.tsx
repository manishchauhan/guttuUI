import { LocalDataStorage } from "./Others";

// Fetech data
export async function sendData(input: RequestInfo, init?: RequestInit)
{
    try
    {
        const response = await fetch(input,init);

        if(!response.ok)
        {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return  response.json();
    }
    catch(e)
    {
        throw new Error(`Something is really wrong${e}`);
    }
    
 }
   
// in case of get when auth is thier
export async function fetchDataAuth(url:string,header:HeadersInit=({
    'Content-Type': 'application/json',
    'Authorization': LocalDataStorage.getToken(`authToken`)
}))
{
    try
    {
        const response = await fetch(url,{
            method: 'GET',
            headers: header,
          });

        if(!response.ok)
        {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
      
        return  response.json();
    }
    catch(e)
    {
        throw new Error(`Something is really wrong${e}`);
    }
}