import roomListStyle from "./roomList.module.css";
import { useEffect, useState } from "react";
import { ModelPopUp } from "../../Components/ModelDialog/PopUp";
import { RoomView } from "./roomView";
import { CallbackFunctionVariadic } from "../../../../Util/Others";
export interface IFroomList {
  show: boolean;
  onClose?: CallbackFunctionVariadic;
}

export const RoomList = (props: IFroomList) => {
  const [show, setShow] = useState(props.show);
  useEffect(() => {
    setShow(props.show);
  }, [props.show]);
  return (
    <div>
      {show && (
        <ModelPopUp
          width={400}
          height={550}
          callBack={() => {
            setShow(!show);
            if (props.onClose) {
              props.onClose(show);
            }
          }}
        >
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
