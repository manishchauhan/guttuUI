/*
    MAIN VIEW
*/

import * as PIXI from 'pixi.js';
export class View extends PIXI.Application
{

     private app:PIXI.Application;
     public root:PIXI.Container;
     constructor(options?: {
        autoStart?: boolean;
        width?: number;
        height?: number;
        view?: HTMLCanvasElement;
        transparent?: boolean;
        autoDensity?: boolean;
        antialias?: boolean;
        preserveDrawingBuffer?: boolean;
        resolution?: number;
        forceCanvas?: boolean;
        backgroundColor?: number;
        clearBeforeRender?: boolean;
        forceFXAA?: boolean;
        powerPreference?: string;
        sharedTicker?: boolean;
        sharedLoader?: boolean;
        resizeTo?: Window | HTMLElement;
    },domElement:HTMLElement=document.body)
     {
       super();
       
       this.app= new PIXI.Application(options as PIXI.Application);
       domElement.appendChild(this.app.view);
       this.root=this.app.stage;
     }
     /*
        GET PIXIJS STAGE
    */
     getStage():PIXI.Container
     {
       return this.app.stage;
     }
     /*
        GET PIXIJS CONTAINER HERE YOU CAN ADD SPRITES AND OTHER STUFF
     */
     getView():PIXI.Application
    {
        return this.app;
    }
    /*
       GET UPDATE LOOP
    */
    update(callBack: {():void})
    {
      this.app.ticker.add(()=>{
         if(callBack)
         {
           callBack();
         }
      })
    }
}