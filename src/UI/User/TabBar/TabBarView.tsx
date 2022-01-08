
import { useEffect, useState } from "react";
import { CallbackFunctionVariadic } from "../../../Util/Others";
import TabBarStyle from "./TabBarStyle.module.css";
export interface IFTab
{
    id:number,
    label:string
}
export interface IFTabBarProps
{
    tabs:Array<IFTab>
    isLogin:boolean,
    callBack:CallbackFunctionVariadic
}

export  const TabBarView=(props:IFTabBarProps)=>{
    const [isLogin,setisLogin]=useState(false);
    useEffect(()=>{
            setisLogin(props.isLogin)
    },[props.isLogin,setisLogin])
    return (<div className={TabBarStyle.tab}>{props.tabs.map((tab)=>{
        return <button key={tab.id} className={TabBarStyle.active} onClick={()=>{
            props.callBack(tab.id)
        }}>{tab.label}</button>
        
    })}
    {isLogin?<button>Logout</button>:<div>Login And play games</div>}
    </div>)
}