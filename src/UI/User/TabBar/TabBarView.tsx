
import TabBarStyle from "./TabBarStyle.module.css";
export interface IFTab
{
    id:number,
    label:string
}
export interface IFTabBarProps
{
    tabs:Array<IFTab>
}

export  const TabBarView=(props:IFTabBarProps)=>{
    return <div className={TabBarStyle.tab}>{props.tabs.map((tab)=>{
        return <button key={tab.id} className={TabBarStyle.active} onClick={()=>{
            console.log("some action")
        }}>{tab.label}</button>
    })}</div>
}