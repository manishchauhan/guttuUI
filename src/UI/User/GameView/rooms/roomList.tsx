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
  pushDataToServer,
  UserAction,
} from "../../../../Util/Others";
import { IFAuthData, IFUser } from "../../UserView";
import { useFetch } from "../../../../Util/CustomHokks";
import { CardView } from "../GameView";
import { FixedPopUp } from "../../Components/PopUps/FixedPopUp";
import { sendData } from "../../../../Util/dataService";

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
  const [roomListData, roomListLoading, setRoomListData, setRoomListDataCache] =
    useFetch<IFroomData>(`http://localhost:4040/room/roomlist`, {
      selected: false,
    });
  const [newRoomHeading, setNewRoomHeading] = useState(`add new room`);
  const [selectedRoomData, setSelectedRoomData] = useState<IFroomData | null>(
    null
  );
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
    // Auth token
    if (
      blockUserAction(
        roomData,
        `You are not allowed to edit other people rooms`
      )
    ) {
      return;
    }
    setRoomMode("UPDATE");
    setNewRoomHeading("Edit this Room");
    dispatchRoomList({
      type: "EDIT",
      payload: { roomData: roomData, show: true },
    });
  }
  /*
    select any room
  */
  function selectAnyRoom(roomData: IFroomData, checked: boolean) {
    // Auth token
    if (
      blockUserAction(
        roomData,
        `You are not allowed to select other people rooms`
      )
    ) {
      return;
    }
    const updateRoomListData = roomListData.map((value) => {
      return roomData.roomid === value.roomid
        ? { ...value, selected: !!checked }
        : value;
    });
    setRoomListDataCache(updateRoomListData);
  }
  /*
    delete a room
  */
  function blockUserAction(roomData: IFroomData, msg: string = ``) {
    const authData: IFAuthData = LocalDataStorage.getObject<IFAuthData>(
      "userData"
    ) as IFAuthData;
    if (authData.userid !== roomData.userid) {
      setRoomMsg(msg);
      if (msgTimeOut) {
        clearInterval(msgTimeOut);
      }
      msgTimeOut = setTimeout(() => {
        setRoomMsg(``);
      }, 2500);
      return true;
    }
    return false;
  }
  function confirmDeleteRoom(roomData: IFroomData) {
    // Auth token
    if (
      blockUserAction(
        roomData,
        `You are not allowed to delete other people rooms`
      )
    ) {
      return;
    }

    setSelectedRoomData(roomData);
  }

  // Delete multiple rooms only those who is created by user
  function confrimDeleteMultipleRooms() {
    console.log("confrim delete multiple rooms");
    setSelectedRoomData({});
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
                  <button
                    onClick={() => {
                      confirmDeleteRoom(item);
                    }}
                  >
                    Delete
                  </button>
                  Select Room :{" "}
                  <input
                    type="checkbox"
                    checked={item.selected}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      selectAnyRoom(item, e.target.checked);
                    }}
                  ></input>
                  {item.selected}
                </div>
                <div>
                  <b>Parent Game : </b> :{" "}
                  <span>
                    {item.parentgame}
                    {item.selected}
                  </span>
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
  function deleteMultiple() {
    let roomids: Array<string | undefined> = [];
    for (let i = 0; i < roomListData.length; i++) {
      if (roomListData[i].selected) {
        roomids.push(roomListData[i].roomid);
      }
    }
    if (roomids.length <= 0) {
      setRoomMsg(`How i can delete if i don't know what to delete`);
      if (msgTimeOut) {
        clearInterval(msgTimeOut);
      }
      msgTimeOut = setTimeout(() => {
        setRoomMsg(``);
        setSelectedRoomData(null);
      }, 2500);
      return;
    }
    const roomToDelete = {
      roomids: roomids,
      ACCESS_TOKEN: LocalDataStorage.getTokenFromCookie(`accessToken`),
    };
    pushDataToServer(
      roomToDelete,
      `http://localhost:4040/room/deletemany`,
      (msg) => {
        const roomListUpdatedData = roomListData.filter((data) => {
          return !roomids.includes(data.roomid);
        });
        setRoomListDataCache(roomListUpdatedData);
        const newMSg =
          roomids.length > 1
            ? `Rooms deleted from the server`
            : `Rooms deleted from the server`;
        setRoomMsg(newMSg);
        setSelectedRoomData(null);
        if (msgTimeOut) {
          clearInterval(msgTimeOut);
        }
        msgTimeOut = setTimeout(() => {
          setRoomMsg(``);
        }, 2500);
      }
    );
  }
  function deleteRoom() {
    const keys = Object.keys(selectedRoomData as object);
    // in case of multiple delete
    if (!keys.length) {
      deleteMultiple();
      return;
    }
    const roomToDelete = {
      roomid: selectedRoomData?.roomid as string,
      ACCESS_TOKEN: LocalDataStorage.getTokenFromCookie(`accessToken`),
    };
    pushDataToServer(
      roomToDelete,
      `http://localhost:4040/room/delete`,
      (msg) => {
        const roomListUpdatedData = roomListData.filter((data) => {
          return data.roomid !== selectedRoomData?.roomid;
        });
        setRoomListDataCache(roomListUpdatedData);
        setRoomMsg(`Room deleted from the server`);
        setSelectedRoomData(null);
        if (msgTimeOut) {
          clearInterval(msgTimeOut);
        }
        msgTimeOut = setTimeout(() => {
          setRoomMsg(``);
        }, 2500);
      }
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

  useEffect(() => {
    setShow(props.show);
  }, [
    props.show,
    roomListData,
    roomListLoading,
    setRoomListData,
    setRoomListDataCache,
  ]);
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
                    confrimDeleteMultipleRooms();
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
                <div
                  className={
                    selectedRoomData !== null
                      ? roomListStyle.fixedPopUpStyleShow
                      : roomListStyle.fixedPopUpStyleHide
                  }
                >
                  <FixedPopUp
                    heading={`Are you sur you want to delete ${
                      selectedRoomData?.roomname as string
                    } Room`}
                    yes="YES"
                    no="NO"
                    callBack={(status) => {
                      if (status) {
                        deleteRoom();
                      } else {
                        setSelectedRoomData(null);
                      }
                    }}
                  >
                    <div>
                      <h3>
                        Please Remember if you delete this room it would be
                        never back you need to recreate it and you would loose
                        all data realted to room
                      </h3>
                    </div>
                  </FixedPopUp>
                </div>
                {!roomListLoading ? displayAllRooms() : <div>Loading.....</div>}
              </div>
            </div>
          </ModelPopUp>
        )}
      </div>
    </RoomListContext.Provider>
  );
};
