import roomListStyle from "./roomList.module.css";
import { useEffect, useState } from "react";
import { ModelPopUp } from "../../Components/ModelDialog/PopUp";
import { RoomView } from "./roomView";
import { CallbackFunctionVariadic, IFGame } from "../../../../Util/Others";
import { IFUser } from "../../UserView";
export interface IFroomListData {
  show?: boolean;
  onClose?: CallbackFunctionVariadic;
  gameData?: IFGame;
  user?: IFUser;
}

export const RoomList = (props: IFroomListData) => {
  const [show, setShow] = useState(props.show);
  const [gameData, setGameData] = useState<IFGame | undefined>(props.gameData);
  const [user, setUser] = useState<IFUser | undefined>(props.user);
  /*
    add a new room for login user
  */
  function addRoom() {
    console.log(user);
    console.log(gameData);
  }

  /*
    select only those room which is created by user so he/she can delete the selected room
  */
  function selectRooms() {}
  /*
    delete a room
  */
  function deleteRoom() {}

  useEffect(() => {
    console.log("render");
    setShow(props.show);
    setGameData(props.gameData);
    setUser(props.user);
  }, [props.show, props.gameData, props.user]);
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
              <button
                onClick={() => {
                  addRoom();
                }}
              >
                Add Room
              </button>
              <button
                onClick={() => {
                  deleteRoom();
                }}
              >
                Remove Room
              </button>
              Select All Rooms
              <input type="checkbox" />
            </div>
          </div>
        </ModelPopUp>
      )}
    </div>
  );
};
