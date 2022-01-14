
import { ReactChild, ReactChildren } from "react";
import { Interface } from "readline";
import { IFAuthData, IFUser } from "../UI/User/UserView";

export type CallbackFunctionVariadic = (...args: any[]) => void;

export class LocalDataStorage
{
    static authData:IFAuthData|undefined=undefined;
    
    static clearObject<T>(key:string)
    {
        if(window.localStorage)
        {
            try
            {
               localStorage.removeItem('key')
            }catch(e)
            {
                throw new Error(`Some problem is with local storage${e}`);
            }
        }
    }
     static setObject<T>(key:string,value:T)
    {
       if(window.localStorage)
       {
           try
           {
              localStorage.setItem(key,JSON.stringify(value));
           }catch(e)
           {
               throw new Error(`Some problem is with local storage${e}`);
           }
       }
    }
    static getObject<T>(key:string):T|undefined
    {
        if(window.localStorage)
        {
            try
            {
              const userData=localStorage.getItem(key);
              return JSON.parse(userData as string) as T;
            }catch(e)
            {
                throw new Error(`Some problem is with local storage${e}`);
            }
        }
    }
    static setItem(key:string,value:string)
    {
       if(window.localStorage)
       {
           try
           {
              localStorage.setItem(key,value);
           }catch(e)
           {
               throw new Error(`Some problem is with local storage${e}`);
           }
       }
    }
    static getItem(key:string):string|undefined
    {
       if(window.localStorage)
       {
           try
           {
             return localStorage.getItem(key) as string;
           }catch(e)
           {
               throw new Error(`Some problem is with local storage${e}`);
           }
       }
    }
    static getToken(key:string):string
    {
        return `Bearer ${this.getItem(key)}`;
    }
    static setAuth(authData:IFAuthData)
    {
        this.authData=authData;
    }
    static Auth()
    {
      if(this.authData===undefined)
      {
          return false;
      }
      return this.authData.isLogin?true:false;
    }
    static getTokenFromCookie(key:string):string|undefined
    {
        const tokenCookie=document.cookie
        .split(`; `)
        .find((row) => row.startsWith("accessToken"));
        if(!tokenCookie)
            return undefined;
        return `Bearer ${document.cookie
        .split(`; `)
        .find((row) => row.startsWith("accessToken"))
        ?.split("=")[1] as string}`;
    }
}

//Mapped table in mysql
/*
	1	gameid Primary	int(11)			No	None		AUTO_INCREMENT	Change Change	Drop Drop	
More More
	2	gamename	varchar(256)	utf8mb4_general_ci		No	None			Change Change	Drop Drop	
More More
	3	gameurl	text	utf8mb4_general_ci		No	None			Change Change	Drop Drop	
More More
	4	gamedesc	longtext	utf8mb4_general_ci		No	None			Change Change	Drop Drop	
More More
	5	multiplayer	tinyint(1)			No	None			Change Change	Drop Drop	
More More
	6	played	bigint(20)			No	None			Change Change	Drop Drop	
More More
	7	gameimg	varchar(256)	utf8mb4_general_ci		No	None			Change Change	Drop Drop	
More More
*/
// Game interface holding all game information
export type GameActionType="SELECT"|"ROLLOVER"|"DETAIL"|"MULTIPLAYER";
export interface IFGame {
    gameid?: number | undefined;
    gamename?: string | undefined;
    gameurl?: string | undefined;
    gamedesc?: string | undefined;
    multiplayer?: boolean;
    played?: number;
    gameimg?: string;
   
  
  }
  
  export interface IFGameProps
  {
      gameData?:IFGame
      children?: ReactChild | ReactChildren;
      callBack?:CallbackFunctionVariadic
  }

  export interface IFgameAndUser
  {
      game?:IFGame,
      user?:IFUser
      show?:boolean
  }
export interface GameAction
{
    type:GameActionType
    payload?:IFgameAndUser
    // pop up status
   
}
/*
roomid	
userid	
gameid	
parentgame	
roomname	
roomdesc	
roomimg	
players*/	
export interface IFroomData
{
    roomid?:string	
    userid?:string	
    gameid?:string	
    parentgame?:string	
    roomname?:string	
    roomdesc?:string	
    roomimg?:string	
    players?:number //no of players allowed
    creator?:string //user who created this room
    
}

export interface playerAllowed {
    value?: number;
    index?: number;
  }
  export const playerAllowedArray: Array<playerAllowed> = [{value:2,index:1},{value:4,index:2},{value:6,index:3},{value:8,index:4},{value:10,index:5}];