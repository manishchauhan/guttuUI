import roomListStyle from "./roomList.module.css";
import { useEffect, useState } from "react";
import { ModelPopUp } from "../../Components/ModelDialog/PopUp";
import { RoomView } from "./roomView";
export interface IFroomList {
  show: boolean;
}

export const RoomList = (props: IFroomList) => {
  return (
    <div>
      {props.show && (
        <ModelPopUp>
          <div>
            <h3>GAME ROOM LIST</h3>
            <button>Add Room</button>
            <button>Remove Room</button>
            Select Room
            <input type="checkbox" />
          </div>
        </ModelPopUp>
      )}
    </div>
  );
};
