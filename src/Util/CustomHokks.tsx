import { useEffect, useState } from "react"
import { IFGame } from "../UI/User/GameView/GameView";
import { fetchDataAuth } from "./dataService";

export const useFetch=(url:string)=>{
    const [data,setData]=useState<Array<IFGame>>([]);
    const [loading,setLoading]=useState<boolean>(true);
    const  fetechData=async()=>{
    
        const apiData= await fetchDataAuth(url);
    
        setData(apiData);
       
    }
    useEffect(  ()=>{
  
        fetechData();
        setLoading(false);
     
    },[])
    return [data,loading] as const
}