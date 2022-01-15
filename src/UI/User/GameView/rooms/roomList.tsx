import roomListStyle from "./roomList.module.css";
import { createContext, useEffect, useReducer, useState } from "react";
import { ModelPopUp } from "../../Components/ModelDialog/PopUp";
import { RoomView } from "./roomView";
import {
  CallbackFunctionVariadic,
  GameAction,
  IFGame,
  IFroomData,
  LocalDataStorage,
  UserAction,
} from "../../../../Util/Others";
import { IFAuthData, IFUser } from "../../UserView";
import { useFetch } from "../../../../Util/CustomHokks";
import { CardView } from "../GameView";

export interface IFroomListData {
  show?: boolean;
  onClose?: CallbackFunctionVariadic;
  gameData?: IFGame;
  user?: IFUser;
  roomData?: IFroomData;
}
/* createContext */
export const RoomListContext = createContext<IFroomListData>({});
/* Reducer */
const roomListReducer = (state: IFroomListData, action: GameAction) => {
  switch (action.type) {
    case "SELECT":
      return {
        show: action.payload?.show,
        gameData: action.payload?.game,
        user: action.payload?.user,
      };
    case "EDIT":
      return {
        ...state,
        roomData: action.payload?.roomData,
        show: action.payload?.show,
      };
    case "CLOSE":
      return {
        show: action.payload?.show,
        gameData: state.gameData,
        user: state.user,
      };
    default:
      return state;
  }
};

export const RoomList = (props: IFroomListData) => {
  let msgTimeOut: any = undefined;
  const [show, setShow] = useState(props.show);
  const [roomMsg, setRoomMsg] = useState<string | undefined>();
  const [roomMode, setRoomMode] = useState<UserAction>("ADD");
  const [roomListState, dispatchRoomList] = useReducer(roomListReducer, {
    show: false,
  });
  const [roomListData, roomListLoading, setRoomListData] = useFetch<IFroomData>(
    `http://localhost:4040/room/roomlist`
  );
  const [newRoomHeading, setNewRoomHeading] = useState(`add new room`);
  /*
    add a new room for login user
  */
  function addRoom() {
    setRoomMode("ADD");
    dispatchRoomList({
      type: "SELECT",
      payload: {
        show: true,
        user: props.user,
        game: props.gameData,
      },
    });
  }
  function editNewRoom(roomData: IFroomData) {
    const authData: IFAuthData = LocalDataStorage.getObject<IFAuthData>(
      "userData"
    ) as IFAuthData;
    if (authData.userid !== roomData.userid) {
      setRoomMsg(`You are not allowed to edit other people rooms`);
      if (msgTimeOut) {
        clearInterval(msgTimeOut);
      }
      msgTimeOut = setTimeout(() => {
        setRoomMsg(``);
      }, 2500);
      return;
    }
    setRoomMode("UPDATE");
    setNewRoomHeading("Edit this Room");
    dispatchRoomList({
      type: "EDIT",
      payload: { roomData: roomData, show: true },
    });
  }

  //  ALL ROOM LIST----------------------------------------------------------
  function displayAllRooms() {
    return (
      <>
        {roomListData.map((item) => {
          return (
            <CardView key={item.roomid}>
              <div className={roomListStyle.cardData}>
                <div className={roomListStyle.cardActionStyle}>
                  <button
                    onClick={() => {
                      editNewRoom(item);
                    }}
                  >
                    Edit
                  </button>
                  <button>Delete</button>
                  Select Room : <input type="checkbox"></input>
                </div>
                <div>
                  <b>Parent Game : </b> : <span>{item.parentgame}</span>
                </div>
                <div>
                  <b>Room Name : </b> {item.roomname}
                </div>
                <div>
                  <b>Room Details : </b> {item.roomdesc}
                </div>
                <div>
                  <b>Creator : </b> {item.creator}
                </div>
                <div>
                  <b>Player Allowed : </b>
                  <span>{item.players}</span>
                </div>
              </div>
            </CardView>
          );
        })}
      </>
    );
  }
  /*
    close room add window
  */
  function closeRoomAddWindow(status: boolean = false) {
    dispatchRoomList({
      type: "CLOSE",
      payload: {
        show: status,
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
            height={600}
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
              <div className={roomListStyle.noPlayerStyle}>
                {roomListData.length > 1 ? "Number of rooms" : "Number of room"}{" "}
                <b>{roomListData.length}</b>{" "}
              </div>
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
              <div className={roomListStyle.searchBarStyle}>
                <b>SEARCH SOMETHING</b>
                <input type="text"></input>
              </div>
              <div className={roomListStyle.roomViewStyle}>
                {roomListState.show && (
                  <RoomView
                    mode={roomMode}
                    heading={newRoomHeading}
                    callBack={(msg) => {
                      setRoomMsg(msg);
                      setTimeout(() => {
                        setRoomMsg(undefined);
                        closeRoomAddWindow();
                        setRoomListData(`http://localhost:4040/room/roomlist`);
                      }, 2500);
                      setNewRoomHeading("add new room");
                    }}
                    closeCallBack={() => {
                      closeRoomAddWindow();
                      setNewRoomHeading("add new room");
                    }}
                  ></RoomView>
                )}
              </div>
              <div className={roomListStyle.cardContainer}>
                {!roomListLoading ? displayAllRooms() : <div>Loading.....</div>}
              </div>
            </div>
          </ModelPopUp>
        )}
      </div>
    </RoomListContext.Provider>
  );
};
