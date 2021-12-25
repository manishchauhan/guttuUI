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
   
