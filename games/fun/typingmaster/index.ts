
import { gsap } from "gsap";
import { PixiPlugin } from "gsap/src/PixiPlugin";
import { MotionPathPlugin } from "gsap/src/MotionPathPlugin";
import * as PIXI from 'pixi.js';
import { InteractionManager } from './Engine/InteractionManager';
import {View} from "./Engine/View"
import { Cannon, IFcannonPartData } from './Game/Cannon';
import { Parashoot } from "./Game/Parashoot";
import { LevelInfo, LevelManager, Limit } from "./Engine/LevelManager";
import { component, Controller } from "./Engine/Component";

/// <reference path="node_modules/pixi-particles/ambient.d.ts" />
//import particles = require('pixi-particles');
import * as particles from 'pixi-particles';
import { addEffect, Collision, fetchJson, rotateToPoint } from "./Game/util/util";
import { Bullet } from "./Game/Bullet";



class Game
{
    private gameView:View;
    private cannon:Cannon;
    private parashootArray:Array<Parashoot>=[];
    private levelManager?:LevelManager;
    private gameLimit:Limit;
    private  paraShootTimer:NodeJS.Timeout;
    private  gameRootDiv:HTMLElement|Document;
    private  blastEffect:particles.Emitter;
    private effectData: particles.EmitterConfig | particles.OldEmitterConfig |undefined;
    private elapsed:number = Date.now();
    private currentActiveLevel:LevelInfo|undefined;
    private bulletArray:Array<Bullet>=[];
    constructor()
    {

            const viewWidth=1024;
            const viewHeight=768
            //game root
            this.gameRootDiv=component.appendChild('div');
            this.gameView=new View({width:viewWidth,height:viewHeight,resolution:window.devicePixelRatio},this.gameRootDiv as HTMLElement);
            const textures=["background.png","backwheel.png","cannonfrontwheel.png","cannonsprite.png",
            "cloud1.png","cloud2.png","dragball.png","parashoot.png","questionbox.png","scorebox.png"];
            this.addAllHTMLPanels();
            textures.map((texture)=>{
                const textureName=(url:string)=>{
                    const newurl=url.split(`/`)[2];
                    let updateName=``;
                    let index=0;
                    while(newurl[index]!=`.`)
                    {
                      
                        updateName+=newurl[index++];
                    }
                    return updateName;
                }
                const url=`./assets/${texture}`;
                
                PIXI.Loader.shared.add(textureName(url),url);
            })
            PIXI.Loader.shared.load((loader:PIXI.Loader, resources:Partial<Record<string, PIXI.LoaderResource>>)=>{
                this.initGame();
            })
            gsap.registerPlugin(PixiPlugin, MotionPathPlugin);
            
    }
    //fecth
    private async fetchAll()
    {
        this.effectData=await fetchJson('./assets/effect/blastEffect.json') as particles.EmitterConfig | particles.OldEmitterConfig | undefined;
    }
    private addAllHTMLPanels()
    {
       // Controller.addSetting(this.gameRootDiv);
    }
    //add Background
    private addBackGround()
    {
       
        const backgroundTexture=PIXI.Loader.shared.resources.background.texture as PIXI.Texture
        const backgroundSprite=PIXI.Sprite.from(backgroundTexture);
        this.gameView.getStage().addChild(backgroundSprite);
        this.gameView.update(()=>{
            this.updateGame();
        });
    }
    private removeParaShoot(parashoot:Parashoot)
    {
        this.gameView.root.removeChild(parashoot);
        const index=this.parashootArray.indexOf(parashoot);
        this.parashootArray.splice(index,1);
    }
    //update the whole game
    private updateGame()
    {
        this.parashootArray.forEach((parashoot,index)=>{
            if(parashoot.y>this.gameView.getView().view.height+parashoot.height)
            {
                this.removeParaShoot(parashoot);
            }
            parashoot.updateY();
        })
        this.cannon.updateWheel();
        const now = Date.now();
         if(this.blastEffect)
         this.blastEffect.update((now - this.elapsed) * 0.001);
         this.elapsed = now;
       this.updateBullets()    

    }
    //update the bullet
    private updateBullets()
    {
        this.bulletArray.forEach((bullet)=>{
     
            bullet.x += Math.cos( this.cannon.nozzleSprite!.rotation-Math.PI/2)*this.cannon.bulletSpeed;
            bullet.y += Math.sin( this.cannon.nozzleSprite!.rotation-Math.PI/2)*this.cannon.bulletSpeed;
            if(Collision.circleCollision(bullet.target,bullet,17,bullet.width))
            {
                 this.addEffect(bullet.target.x,bullet.target.y)
                this.removeParaShoot(bullet.target);
                this.removeBullet(bullet)
            }
        })
    }
    //remove bullet  
    private removeBullet(bullet:Bullet)
    {
        this.gameView.root.removeChild(bullet);
        const index=this.bulletArray.indexOf(bullet);
        this.bulletArray.splice(index,1);
    }
    private setLevelManager()
    {
      
       
        
        this.currentActiveLevel=this.levelManager!.currentActiveLevel();
        this.levelManager!.getRandomWords(this.levelManager!.currentLevel);
        this.paraShootTimer=setInterval(()=>{
         this.addTarget();
        },this.currentActiveLevel?.levelShotTime as number);
    }
    //Add Game
    private initGame()
    {
        this.fetchAll();
        this.addBackGround();
        this.addCannon();
        this.addUserInteraction();
        this.setOthers();
        //set level manager for the game
        this.levelManager=new LevelManager();
        this.setLevelManager();
       
    }
    private setOthers()
    {
        const fakeparashoot=new Parashoot(PIXI.Loader.shared.resources.parashoot.texture as PIXI.Texture);
        fakeparashoot.x=-1000;
        fakeparashoot.y=-1000;

        this.gameLimit={
            xMin:(fakeparashoot.width/2),
            xMax:(this.gameView.view.width+fakeparashoot.width/2),
            yMin:-150,
            yMax:-140
        }
        this.levelManager?.setLimit(this.gameLimit);
    }
    //add a target and given time
    private addTarget()
    {
        const parashoot=new Parashoot(PIXI.Loader.shared.resources.parashoot.texture as PIXI.Texture);
        parashoot.x=this.levelManager!.randomNumber(this.gameLimit.xMin,this.gameLimit.xMax)
        parashoot.y=this.levelManager!.randomNumber(this.gameLimit.yMin,this.gameLimit.yMax);
        parashoot.ySpeed=this.levelManager!.randomNumber(0.5,2.5);
        parashoot.addText(this.levelManager!.getCurrentTarget());
        this.gameView.root.addChild(parashoot);
        this.parashootArray.push(parashoot);
    }
    private addUserInteraction()
    {
        
        InteractionManager.MouseDown((event:MouseEvent)=>{
           const oldX=this.cannon.x;
           const newX=event.clientX-this.cannon.width/2;
           if(newX-oldX>0)
           {
               this.cannon.direction=1
           }else
           {
               this.cannon.direction=-1;
           }
            const timeTaken=Math.abs((newX-oldX)/1000);
           gsap.to(this.cannon,timeTaken,{x:newX});
        })

        InteractionManager.keyUp((event:KeyboardEvent)=>{
            this.checkKeyCollide(event.key);
        })
    }
    //auto shoot bullet at given direction
    private shootBullet(x:number,y:number,rotation:number,parashoot:Parashoot)
    {
        const bulletTexture=PIXI.Loader.shared.resources.dragball.texture as PIXI.Texture
        const bullet=new Bullet(bulletTexture);
        bullet.anchor.set(0.5,0.5);
        bullet.x=x;
        bullet.y=y;
        bullet.target=parashoot;
        this.gameView.root.addChild(bullet);
        this.bulletArray.push(bullet);
        
        this.cannon.nozzleSprite!.rotation=Math.PI/2+rotateToPoint(bullet.target.x,bullet.target.y,bullet.x,bullet.y);
    }
    //process process to next level util user cleared the current Level
    clearRunningGame()
    {
        clearInterval(this.paraShootTimer);
        this.setLevelManager();
        
    }
    processGame()
    {
        if(this.levelManager?.ProgressLevel())
        {
            
            this.clearRunningGame();
        }
    }
    //check collison based on key press
    private checkKeyCollide(key:string)
    {
      
        this.parashootArray.forEach((parashoot)=>{
            if(parashoot.targetFound(key))
           {
                const cannonPoint=this.cannon!.toGlobal({x:this.cannon.nozzleSprite!.x,y:this.cannon.nozzleSprite!.y});
                this.shootBullet(cannonPoint.x,cannonPoint.y,this.cannon.nozzleSprite!.rotation,parashoot);
                this.processGame();
           }
        })
    }
    //Add cannon
    private addCannon()
    {
        const cannonData:Array<IFcannonPartData>=[
            {texture:PIXI.Loader.shared.resources.cannonsprite.texture as PIXI.Texture,point:new PIXI.Point(100,100)},
            {texture:PIXI.Loader.shared.resources.backwheel.texture as PIXI.Texture,point:new PIXI.Point(100,100)},
            {texture:PIXI.Loader.shared.resources.backwheel.texture as PIXI.Texture,point:new PIXI.Point(100,100)}
        ];
        this.cannon=new Cannon(cannonData);
        this.cannon.direction=1;
        this.cannon.x=-this.gameView.getView().view.width/2-this.cannon.width/2;
        this.cannon.y=this.gameView.getView().view.height-this.cannon.height;
         const x=this.gameView.getView().view.width/2-this.cannon.width/2;
        const y=this.gameView.getView().view.height-this.cannon.height/1.15;
        gsap.to(this.cannon, {x:x, y:y,  ease: "back.out(1.7)"});
        this.gameView.getStage().addChild(this.cannon);
      
    }
 
  
     addEffect(__x:number,__y:number) {
        
        this.effectData!.pos.x=__x;
        this.effectData!.pos.y=__y;
        this.blastEffect= addEffect(this.gameView.getStage(),'./assets/effect/particle.png',this.effectData);
        this.blastEffect.emit=true;
      }
}
const typingGame=new Game();

