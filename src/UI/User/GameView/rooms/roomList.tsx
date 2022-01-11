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
        <ModelPopUp width={375} height={550}>
          <div>
            <h3 className={roomListStyle.heading}>GAME ROOM LIST</h3>
            <div className={roomListStyle.topMenu}>
              <button>Add Room</button>
              <button>Remove Room</button>
              Select All Rooms
              <input type="checkbox" />
            </div>
          </div>
        </ModelPopUp>
      )}
    </div>
  );
};
