import { ReactChild, ReactChildren } from "react";
import { CallbackFunctionVariadic } from "../../../../Util/Others";
import FixedPopUpStyle from "./FixedPopUp.module.css";
export interface IFPopData {
  heading: string;
  yes: string;
  no: string;
  children?: ReactChild | ReactChildren;
  callBack?: CallbackFunctionVariadic;
  width?: number | undefined;
  height?: number | undefined;
}
export const FixedPopUp = (props: IFPopData) => {
  return (
    <div
      className={FixedPopUpStyle.popContainer}
      style={{
        width: props.width ? props.width : 400,
        height: props.height ? props.height : 200,
      }}
    >
      <div className={FixedPopUpStyle.headerstyle}>{props.heading}</div>
      <div>
        <div>{props.children}</div>
        <button
          onClick={() => {
            if (props.callBack) {
              props.callBack(true);
            }
          }}
        >
          {props.yes}
        </button>{" "}
        <button
          onClick={() => {
            if (props.callBack) {
              props.callBack(false);
            }
          }}
        >
          {props.no}
        </button>
      </div>
    </div>
  );
};
