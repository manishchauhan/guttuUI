import { IFAuthData } from "../UI/User/UserView";

export type CallbackFunctionVariadic = (...args: any[]) => void;

export class LocalDataStorage
{
    static authData:IFAuthData|undefined=undefined;
    
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

