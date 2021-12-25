import * as PIXI from 'pixi.js';
/// <reference path="node_modules/pixi-particles/ambient.d.ts" />
//import particles = require('pixi-particles');
import * as particles from 'pixi-particles';
import { Parashoot } from '../Parashoot';
export class GameTextStyle
{
   static  ParashootLabelStyle:PIXI.TextStyle=new PIXI.TextStyle({
        fontFamily: "Times New Roman",
        fontWeight: "bold",
        fill: [
            "#ffffff",
            "#ffffff"
        ],
    });

    static  ParashootLabelStyleHighLight:PIXI.TextStyle=new PIXI.TextStyle({
        fontFamily: "Times New Roman",
        fontWeight: "bold",
        fill: [
            "#ffd91a"
        ],
    });
   
}

/*
    fetech any type of json
*/
export async function fetchJson(url:string) {
 
    try {
        const response=await fetch(url);
   
        return response.json();
    } catch (error) {
        console.log(error);
    }
}

/*
    add a particle on container
*/
export function addEffect(container:PIXI.Container,textureUrl:string,config: particles.EmitterConfig | particles.OldEmitterConfig | undefined):particles.Emitter {

    return new particles.Emitter(
    
        // The PIXI.Container to put the emitter in
        // if using blend modes, it's important to put this
        // on top of a bitmap, and not use the root stage Container
        container,
        
        [PIXI.Texture.from(textureUrl)],
      
        // Emitter configuration, edit this to change the look
        // of the emitter
        config as particles.EmitterConfig | particles.OldEmitterConfig
      );
    
    
}

/*
    rotate at target direction
*/
export function rotateToPoint(x1:number,y1:number,x2:number,y2:number) {
    const dist_Y = y1 - y2;
    const dist_X = x1 - x2;
    const angle = Math.atan2(dist_Y,dist_X);
    return angle;
}

/*
collision class required for collision*/
export class Collision {
    static circleCollision(spriteA: PIXI.Sprite|Parashoot, shape2: PIXI.Sprite,radiusA:number,radiusB:number): boolean {
      let intersect = false;
      let dx = spriteA.x - shape2.x;
      let dy = spriteA.y - shape2.y;
      let distance = dx * dx + dy * dy;
  
      if (
        distance <=
        (radiusA +  radiusB ) *
          (radiusA + radiusB)
      ) {
        intersect = true;
      }
      return intersect;
    }
}