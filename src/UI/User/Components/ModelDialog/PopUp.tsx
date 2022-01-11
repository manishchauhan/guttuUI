import { ReactChild, ReactChildren } from "react";
import { CallbackFunctionVariadic } from "../../../../Util/Others";
import PopUpStyle from "./PopUp.module.css";

/*
  Don't use it directly instead extend it based on requirement
  @title title for the popup
  @details content data for popup
*/
export interface IFPopUpModelData {
  title?: string;
  detail?: string;
  children?: ReactChild | ReactChildren;
  callBack?: CallbackFunctionVariadic;
  backgroundStyle?: string | undefined;
  contentStyle?: string | undefined;
  closeStyle?: string | undefined;
  width?: number;
  height?: number;
}
export const ModelPopUp = (props: IFPopUpModelData) => {
  return (
    <>
      <div
        className={
          !props.backgroundStyle ? PopUpStyle.modal : props.backgroundStyle
        }
      >
        <div
          className={
            !props.contentStyle ? PopUpStyle.content : props.contentStyle
          }
          style={{ width: props.width, height: props.height }}
        >
          <span
            className={!props.closeStyle ? PopUpStyle.close : props.closeStyle}
          >
            &times;
          </span>
          <div>{props.children}</div>
        </div>
      </div>
    </>
  );
};
