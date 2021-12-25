import * as PIXI from 'pixi.js';
import { Parashoot } from './Parashoot';
export class Bullet extends PIXI.Sprite
{
    public target:Parashoot;
    constructor(texture:PIXI.Texture|undefined)
    {
        super(texture)
    }

}