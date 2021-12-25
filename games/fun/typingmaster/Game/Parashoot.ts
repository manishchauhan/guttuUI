import * as PIXI from 'pixi.js';
import { GameTextStyle } from './util/util';
import { gsap } from "gsap";
export class Parashoot extends PIXI.Container
{
    public ySpeed:number=0;
    public text:string=``;
    public collideText=``;
    public textContainer:PIXI.Container;
    private textArray:Array<PIXI.Text>=[];
    private textCounter=0;
    private totalCounter=0;
    constructor(_baseTexture:PIXI.Texture)
    {
        super();
        const baseSprite=new PIXI.Sprite(_baseTexture);
        baseSprite.anchor.set(0.5,0.5);
        this.addChild(baseSprite);
    }
    addText(textValue:string)
    {
        this.textContainer=new PIXI.Container();
        let xPosition=0;
        this.totalCounter=textValue.length
        for(let i=0;i<textValue.length;i++)
        {
            const style=GameTextStyle.ParashootLabelStyle;
            const text = new PIXI.Text(textValue[i], style);
            text.x=xPosition;
            text.y=this.height/4.25;
            this.textContainer.addChild(text);
            xPosition+=text.width;
            this.textArray.push(text);
        }
        this.textContainer.x=-this.textContainer.width/2;
        this.addChild(this.textContainer);
        this.text=textValue;

     }
     private manipulateText(index:number)
     {
        const textArray = this.text.split(``);
         textArray.splice(index, 1).join('');
        return textArray.join(``);
     }
     lockHighLightText(userinput:string)
     {
         this.textArray.forEach((text)=>{
             if(text.text===userinput)
             {
                 text.style=GameTextStyle.ParashootLabelStyleHighLight;
                 gsap.to(text.scale,0.5, {x:1.5,y:1.5,ease: "back.out(1.7)",onComplete:()=>{
                    gsap.to(text.scale,0.25,{x:1,y:1})
                 }});
             }
         })
     }
     targetFound(userinput:string):boolean
     {
         let status=false;
         const index=this.text.indexOf(userinput);
     
         if(index>=0)
         {
            this.textCounter++;
            this.text=this.manipulateText(index);
            this.lockHighLightText(userinput);
         }
         if( this.totalCounter===this.textCounter)
         {
            status=true;
            this.textCounter=0;
             return status;
         }
         return status;
     }
     
    stop()
    {
        this.ySpeed=0;
    }
    updateY()
    {
       this.y+=this.ySpeed; 
    }   
}