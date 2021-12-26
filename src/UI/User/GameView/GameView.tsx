import { ReactChild, ReactChildren, useEffect, useState } from "react";
import { useFetch } from "../../../Util/CustomHokks";
import GameStyle  from "./GameStyle.module.css";
export interface IFGame
{
    gameid?:number,
    gamename?:string,
    gameurl?:string,
    gamedesc?:string,
    multiplayer?:boolean
    children?: ReactChild | ReactChildren;
}
// Card view for the game
export const CardView=(props:IFGame)=>{

    return (<div className={GameStyle.cardview}>
    {props.children}
  </div>)
}
export const GameView=()=>{
   const [data,loading]=useFetch(`http://localhost:4040/user/fungames`);
  

    return (
    
    <div>
      {!loading?
        data.map((item)=>{
          return (<CardView key={item.gameid}>
        <div className={GameStyle.containerview}>
          <h4><b>Game name: {item.gamename}</b></h4>
          <p>Game Details: {item.gamedesc}</p>
          <b>Multiplayer: {item.multiplayer?"Yes":"No"}</b>
        </div>
          </CardView>)
        })
      :<div>Loading data...</div>}
      
    </div>)
}