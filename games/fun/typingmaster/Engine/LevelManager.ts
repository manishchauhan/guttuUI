

export enum LevelProgressEnum
{
    init=0,
    start,
    progress,
    over,
    end
}
export interface IFgameOver
{
    level:number,
    status:LevelProgressEnum
}
export interface Limit
{
    xMin?:number;
    xMax?:number;
    yMin?:number;
    yMax?:number;
}
export interface LevelInfo
{
    //which level you are
    level:number,
    //how many target set to per level
    target:number
    //details
    details?:string,
    levelShotTime:number,
    scoreRequired?:number,
    scoreNeeds?:number
}
export function randomSuffle<T>(data:Array<T>):Array<T>
{
     for(let i=data.length-1;i>0;i--)
     {
          const index=Math.floor(Math.random() * (i + 1));
          [data[i],data[index]]=[data[index],data[i]]
     }
     return data;
}


export class LevelManager
{
    public totalLevel=0;
    public currentLevel=1;
    public levelProgressEnum:LevelProgressEnum=LevelProgressEnum.init
    public limit:Limit;
    public wordsArray:Array<string>=new Array();
    //level map with static fill
    public levelMap:Map<number,LevelInfo>=new Map();
    private allLetters:Array<string>=[];
    private wordIndex:number=-1;
    constructor(_totalLevel:number=100)
    {
        //all level info
        this.levelMap?.set(1,{level:1,target:5,levelShotTime:5000,scoreNeeds:0,scoreRequired:3}).set(2,{level:2,target:5,levelShotTime:5000,scoreNeeds:0,scoreRequired:3})
        .set(3,{level:3,target:5,levelShotTime:5000,scoreNeeds:0,scoreRequired:3}).set(4,{level:4,target:5,levelShotTime:5000,scoreNeeds:0,scoreRequired:3})
        .set(5,{level:5,target:5,levelShotTime:5000,scoreNeeds:0,scoreRequired:3}).set(6,{level:6,target:5,levelShotTime:5000,scoreNeeds:0,scoreRequired:3})
        .set(7,{level:7,target:5,levelShotTime:5000,scoreNeeds:0,scoreRequired:3})
        this.allLetters=this.letterBuilder();
        this.levelProgressEnum=LevelProgressEnum.start;
        this.totalLevel=_totalLevel;
    }
    public resetLevel(_currentLevel:number=0)
    {
        this.levelProgressEnum=LevelProgressEnum.start;
        this.currentLevel=_currentLevel;
        
    }
    public gameOver():IFgameOver
    {
        this.levelProgressEnum=LevelProgressEnum.over;
        return {level:this.currentLevel,status:this.levelProgressEnum}
    }
    public checkLevelProgess():LevelProgressEnum|number
    {
        if(this.currentLevel>=this.totalLevel)
        {
            this.levelProgressEnum=LevelProgressEnum.end;
            return  this.levelProgressEnum ;
        }
        return ++this.currentLevel;
    }
    public setLimit(limit:Limit)
    {
        this.limit=limit;
    }
    public randomNumber(min:number=0, max:number=0):number {
        return Math.random() * (max - min) + min;
      }
    private letterBuilder():Array<string>
    {
        let letters=[];
        for(let i=0;i<26;i++)
        {
            const letter=String.fromCharCode(65+i);
            letters.push(letter);
        }
        return letters;
    }
    public currentActiveLevel(level:number=1):LevelInfo|undefined
    {
        const currentLevelObject=this.levelMap!.get(level);
        return currentLevelObject;
    }
    //fisher fate
    public getRandomWords(level:number=1):Array<string>
    {
        this.wordsArray=[];
        const currentLevelObject=this.levelMap!.get(level);
        for(let i=0;i<currentLevelObject!.target;i++)
        {
            let wordString:string=``;
            for(let j=0;j<currentLevelObject!.level;j++)
            {
               
                const index=Math.round(this.randomNumber(0,25));
                wordString+=this.allLetters[index];
               
            }
            this.wordsArray.push(wordString);
         }
 
        return this.wordsArray;
    }
    public getCurrentTarget():string
    {
        const currentLevelObject=this.levelMap!.get(this.currentLevel);
      
        if(this.wordIndex>=currentLevelObject!.target-1)
        {
            randomSuffle(this.wordsArray);
            this.wordIndex=-1;
        }
        this.wordIndex++;
        return this.wordsArray[this.wordIndex]
    }
    public ProgressLevel():boolean
    {
        const currentLevelObject=this.levelMap!.get(this.currentLevel);
        currentLevelObject!.scoreNeeds!++;
        if(currentLevelObject!.scoreRequired!<=currentLevelObject!.scoreNeeds!)
        {
            this.currentLevel++;
            if(this.currentLevel>this.levelMap.size)
            {
                this.currentLevel=this.levelMap.size;
                return true;
            }
            return true;
        }
        return false;
    }
}