//
export async function sendData(input: RequestInfo, init?: RequestInit)
{
    const response = await fetch(input,init);
    if(!response.ok)
    {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
}

