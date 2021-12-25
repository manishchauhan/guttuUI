import * as PIXI from 'pixi.js';
//private to this class only
export interface IFcannonPartData
{
    texture?:PIXI.Texture;
    point:PIXI.Point
}
export class Cannon extends PIXI.Container
{
        public bulletSpeed:number=25;
        public direction=0;
        public rotationSpeed=1;
        private cannonData:Array<IFcannonPartData>;
        constructor(__cannonData:Array<IFcannonPartData>,public nozzleSprite?:PIXI.Sprite,private leftWheelSprite?:PIXI.Sprite,private rightWheelSprite?:PIXI.Sprite)
        {
            super();
            this.cannonData=__cannonData;
            
            this.addLeftWheel(this.cannonData[1]);
            this.addNozzle(this.cannonData[0]);
            this.addRightWheel(this.cannonData[2]);
        }
        //add nozzle 
        addNozzle(data:IFcannonPartData)
        {
            this.nozzleSprite=new PIXI.Sprite(data.texture);
            this.nozzleSprite.anchor.set(0.5,1);
            this.nozzleSprite.x=this.nozzleSprite.width/2;
            this.nozzleSprite.y=this.nozzleSprite.height/1.2;
            this.addChild(this.nozzleSprite)
        }
        //add left wheel
        addLeftWheel(data:IFcannonPartData)
        {
            this.leftWheelSprite=new PIXI.Sprite(data.texture);
            this.leftWheelSprite.anchor.set(0.5,0.5);
            this.addChild(this.leftWheelSprite)
        }
        //add right wheel
        addRightWheel(data:IFcannonPartData)
        {
            this.rightWheelSprite=new PIXI.Sprite(data.texture);
            this.rightWheelSprite.anchor.set(0.5,0.5);
            this.leftWheelSprite!.y= this.leftWheelSprite!.height/2+this.nozzleSprite!.height/2.25;
            this.leftWheelSprite!.x=this.leftWheelSprite!.width/2;
            this.rightWheelSprite.x=this.rightWheelSprite!.width/2;
            this.rightWheelSprite.y= this.rightWheelSprite.height/2+this.nozzleSprite!.height/2;
            this.addChild(this.rightWheelSprite)
        }
        updateWheel()
        {
            this.rightWheelSprite!.rotation+=this.rotationSpeed*this.direction
            this.leftWheelSprite!.rotation+=this.rotationSpeed*this.direction
        }
}