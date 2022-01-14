import roomListStyle from "./roomList.module.css";
import { createContext, useEffect, useReducer, useState } from "react";
import { ModelPopUp } from "../../Components/ModelDialog/PopUp";
import { RoomView } from "./roomView";
import {
  CallbackFunctionVariadic,
  GameAction,
  IFGame,
} from "../../../../Util/Others";
import { IFUser } from "../../UserView";

export interface IFroomListData {
  show?: boolean;
  onClose?: CallbackFunctionVariadic;
  gameData?: IFGame;
  user?: IFUser;
}
/* createContext */
export const RoomListContext = createContext<IFroomListData>({});
/* Reducer */
const roomListReducer = (state: IFroomListData, action: GameAction) => {
  switch (action.type) {
    case "SELECT":
      const newState = {
        show: action.payload?.show,
        gameData: action.payload?.game,
        user: action.payload?.user,
      };
      console.log(newState);
      return newState;
    default:
      return state;
  }
};

export const RoomList = (props: IFroomListData) => {
  const [show, setShow] = useState(props.show);
  const [roomMsg, setRoomMsg] = useState<string | undefined>();
  const [roomListState, dispatchRoomList] = useReducer(roomListReducer, {
    show: false,
  });

  /*
    add a new room for login user
  */
  function addRoom() {
    dispatchRoomList({
      type: "SELECT",
      payload: {
        show: true,
        user: props.user,
        game: props.gameData,
      },
    });
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
    setShow(props.show);
  }, [props.show]);
  return (
    <RoomListContext.Provider value={roomListState}>
      <div>
        {show && (
          <ModelPopUp
            width={600}
            height={550}
            callBack={() => {
              setShow(!show);
              if (props.onClose) {
                props.onClose(show);
              }
            }}
          >
            <div>
              {roomMsg && (
                <div className={roomListStyle.roomSuccessStyle}>{roomMsg}</div>
              )}
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
              <div className={roomListStyle.roomViewStyle}>
                {roomListState.show && (
                  <RoomView
                    callBack={(msg) => {
                      setRoomMsg(msg);
                      setTimeout(() => {
                        setRoomMsg(undefined);
                      }, 2500);
                    }}
                  ></RoomView>
                )}
              </div>
            </div>
          </ModelPopUp>
        )}
      </div>
    </RoomListContext.Provider>
  );
};
