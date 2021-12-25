import GameStyle  from "./GameStyle.module.css";
export interface IFGame
{
    gameid?:number,
    gamename?:string,
    gameurl?:string,
    gamedesc?:string,
    multiplayer?:boolean
}
// Card view for the game
export const CardView=(props:IFGame)=>{
    return (<div className={GameStyle.cardview}>

    <div className={GameStyle.containerview}>
      <h4><b>John Doe</b></h4>
      <p>Architect & Engineer</p>
    </div>
  </div>)
}
export const GameView=()=>{
    return <div><CardView></CardView></div>
}