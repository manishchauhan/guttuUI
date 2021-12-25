
export interface IFGame
{
    gameid:number,
    gamename:string,
    gameurl:string,
    gamedesc?:string,
    multiplayer?:boolean
}
// Card view for the game
export const CardView=(props:IFGame)=>{
    
}
export const GameView=()=>{
    return <div>this is game view</div>
}