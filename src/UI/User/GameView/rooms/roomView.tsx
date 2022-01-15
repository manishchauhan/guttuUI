import { useContext, useEffect, useState } from "react";
import { sendData } from "../../../../Util/dataService";
import {
  CallbackFunctionVariadic,
  IFroomData,
  LocalDataStorage,
  playerAllowedArray,
  UserAction,
} from "../../../../Util/Others";
import { ModelPopUp } from "../../Components/ModelDialog/PopUp";
import { IFroomListData, RoomListContext } from "./roomList";
import roomViewStyle from "./roomView.module.css";

interface IFroomView {
  callBack?: CallbackFunctionVariadic;
  closeCallBack?: CallbackFunctionVariadic;
  heading?: string; //room heading
  mode?: UserAction;
  roomData?: IFroomData;
}
interface IFroomMergeData {
  roomid?: number | string;
  gameid?: number;
  userid?: number;
  roomname?: string;
  roomdesc?: string;
  players?: number;
  parentgame?: string;
  creator?: string;
  ACCESS_TOKEN?: string;
}
export const RoomView = (props: IFroomView) => {
  const roomDataContext = useContext<IFroomListData>(RoomListContext);
  const [roomName, setRoomName] = useState<string | undefined>(
    roomDataContext.roomData?.roomname
      ? roomDataContext.roomData?.roomname
      : undefined
  );
  const [roomMode, setRoomMode] = useState<UserAction>(
    props.mode as UserAction
  );
  const [roomDetails, setRoomDetails] = useState<string | undefined>(
    roomDataContext.roomData?.roomdesc
      ? roomDataContext.roomData?.roomdesc
      : undefined
  );

  const [imgFile, setImgFile] = useState<File | undefined | null>();
  const [noOfplayers, setNoOfplayers] = useState(
    roomDataContext.roomData?.players ? roomDataContext.roomData?.players : 2
  );
  //allow atleast 2 player if user don't select

  // UPDATE A ROOM
  async function updateRoom() {
    if (
      roomName === undefined ||
      roomName.trim() === `` ||
      roomDetails === undefined ||
      roomDetails.trim() === ``
    ) {
      alert("roomName and roomDetails can't be empty");
      return;
    }
    const newRoomData: IFroomMergeData = {
      roomid: roomDataContext.roomData?.roomid,
      roomname: roomName,
      roomdesc: roomDetails,
      players: noOfplayers,
      ACCESS_TOKEN: LocalDataStorage.getTokenFromCookie(`accessToken`),
    } as const;

    pushDataToServer<IFroomMergeData>(
      newRoomData,
      `http://localhost:4040/room/update`
    );
  }

  // PUSH DATA BACK TO THE SERVER
  async function pushDataToServer<T>(newRoomData: T, url: string) {
    const result = await sendData(url, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(newRoomData),
    });
    if (props.callBack) {
      props.callBack(result.message);
    }
  }

  // CREATE ROOM
  async function createRoom() {
    if (
      roomName === undefined ||
      roomName.trim() === `` ||
      roomDetails === undefined ||
      roomDetails.trim() === ``
    ) {
      alert("roomName and roomDetails can't be empty");
      return;
    }

    const newRoomData: IFroomMergeData = {
      gameid: roomDataContext.gameData?.gameid,
      userid: roomDataContext.user?.UserId,
      roomname: roomName,
      roomdesc: roomDetails,
      players: noOfplayers,
      parentgame: roomDataContext.gameData?.gamename,
      creator: roomDataContext.user?.UserName,
      ACCESS_TOKEN: LocalDataStorage.getTokenFromCookie(`accessToken`),
    } as const;
    pushDataToServer<IFroomMergeData>(
      newRoomData,
      `http://localhost:4040/room/add`
    );
  }

  return (
    <ModelPopUp
      width={400}
      backgroundStyle="modal"
      contentStyle="content"
      callBack={() => {
        if (props.closeCallBack) {
          props.closeCallBack();
        }
      }}
    >
      <div className={roomViewStyle.contentClass}>
        <h1>{props.heading}</h1>
        <b>Room name: </b>
        <input
          type="text"
          defaultValue={roomDataContext.roomData?.roomname}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setRoomName(e.target.value);
          }}
        ></input>
        <b>Room details:</b>
        <textarea
          defaultValue={roomDataContext.roomData?.roomdesc}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
            setRoomDetails(e.target.value);
          }}
        ></textarea>
        <b>Room Image:</b>
        <input
          type="file"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setImgFile(e.target.files?.item(0));
          }}
          accept="image/*"
        ></input>
        <b>Select Player Allowed:</b>
        <select
          defaultValue={roomDataContext.roomData?.players}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
            setNoOfplayers(Number(e.target.value));
          }}
        >
          {playerAllowedArray.map((item) => {
            return <option key={item.index}>{item.value}</option>;
          })}
        </select>
        {roomMode === `ADD` ? (
          <button
            className={roomViewStyle.buttonStyle}
            onClick={() => {
              createRoom();
            }}
          >
            Create
          </button>
        ) : (
          <button
            className={roomViewStyle.buttonStyle}
            onClick={() => {
              updateRoom();
            }}
          >
            Update
          </button>
        )}
      </div>
    </ModelPopUp>
  );
};
