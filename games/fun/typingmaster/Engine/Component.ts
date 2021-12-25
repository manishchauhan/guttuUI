export type componentType=`div`|`button`;
export class component
{
    static appendChild(type:componentType,target:HTMLElement|Document=document):HTMLElement|Document
    {
        const element=document.createElement(type);
        //if target is Document type only one child allowed
        if(target instanceof Document)
        {
            target.body.appendChild(element);
        }else
        {
            target.appendChild(element);
        }
        return element;
    }
}
export class Controller
{
    static addSetting(target:HTMLElement|Document)
    {
        const panel=component.appendChild('div',target) as HTMLElement;
        panel.style.width='50px';
        panel.style.height='200px';
        panel.style.background='green'
        panel.style.position='fixed'
    }
}