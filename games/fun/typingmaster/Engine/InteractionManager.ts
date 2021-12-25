import { CallbackFunctionVariadic } from "./Others";

export class InteractionManager 
{
    static keyDownCount=0;
    static dragAllowed=false;
    /*add Key press Event*/
    static keyPress(callBack?:CallbackFunctionVariadic,domElement:HTMLElement=document.body){
        domElement.addEventListener('keypress',(event:KeyboardEvent)=>{
            if(callBack)
               callBack(event);
               
        })
    }
    /*add click event*/
    static addClick(callBack?:CallbackFunctionVariadic,domElement:HTMLElement=document.body)
    {

    }
    /*add mouse move*/
    static MouseMove(callBack?:CallbackFunctionVariadic,domElement:HTMLElement=document.body)
    {

    }
    /*add mouseup Event*/
    static MouseUp(callBack?:CallbackFunctionVariadic,domElement:HTMLElement=document.body)
    {
        domElement.addEventListener('mouseup',(event:MouseEvent)=>{
            if(callBack)
            callBack(event);
            this.dragAllowed=true;
    })
    }
   /*add mouse down Event*/
   static MouseDown(callBack?:CallbackFunctionVariadic,Once:boolean=false,domElement:HTMLElement=document.body)
   {
        domElement.addEventListener('mousedown',(event:MouseEvent)=>{
            if(callBack)
            callBack(event);
            this.dragAllowed=false;
    })
   }
 
   /*key Down*/
   static keyDown(callBack?:CallbackFunctionVariadic,Once:boolean=false,domElement:HTMLElement=document.body)
   {
       
        domElement.addEventListener('keydown',(event:KeyboardEvent)=>{
            if(this.keyDownCount===1 && Once)
               {
                    return;
               }
            if(Once && this.keyDownCount===0 )    {
                this.keyDownCount+=1;
                 
               }
            if(callBack)
            callBack(event);
            
        })   
      
   }
   /*Key up*/
   static keyUp(callBack?:CallbackFunctionVariadic,domElement:HTMLElement=document.body)
   {
    domElement.addEventListener('keyup',(event:KeyboardEvent)=>{

        if(callBack)
        {
            this.keyDownCount=0;
            callBack(event);
        }
           
           
    })
  
   }
   //special events on mouse hold and drag
   static darg(callBack?:CallbackFunctionVariadic,domElement:HTMLElement=document.body)
   {

   }
   static dblClick(callBack?:CallbackFunctionVariadic,domElement:HTMLElement=document.body)
   {
    domElement.addEventListener('dblclick',(event:MouseEvent)=>{
        if(callBack)
           callBack(event);
           
    })
   }
}