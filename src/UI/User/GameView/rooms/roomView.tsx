import { useContext, useEffect, useState } from "react";
import { sendData } from "../../../../Util/dataService";
import {
  CallbackFunctionVariadic,
  IFroomData,
  LocalDataStorage,
  playerAllowedArray,
} from "../../../../Util/Others";
import { ModelPopUp } from "../../Components/ModelDialog/PopUp";
import { IFroomListData, RoomListContext } from "./roomList";
import roomViewStyle from "./roomView.module.css";
interface IFroomView {
  callBack?: CallbackFunctionVariadic;
  closeCallBack?: CallbackFunctionVariadic;
}
export const RoomView = (props: IFroomView) => {
  const roomData = useContext<IFroomListData>(RoomListContext);
  const [roomName, setRoomName] = useState("");
  const [roomDetails, setRoomDetails] = useState("");
  const [imgFile, setImgFile] = useState<File | undefined | null>();
  const [noOfplayers, setNoOfplayers] = useState(2);
  //allow atleast 2 player if user don't select

  async function createRoom() {
    if (roomName === `` || roomDetails === "") {
      alert("roomName and roomDetails can't be empty");
      return;
    }

    const newRoomData = {
      gameid: roomData.gameData?.gameid,
      userid: roomData.user?.UserId,
      roomname: roomName,
      roomdesc: roomDetails,
      players: noOfplayers,
      parentgame: roomData.gameData?.gamename,
      creator: roomData.user?.UserName,
      ACCESS_TOKEN: LocalDataStorage.getTokenFromCookie(`accessToken`),
    };
    const result = await sendData(`http://localhost:4040/room/add`, {
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
        <h1>Create a Room </h1>
        <b>Room name: </b>
        <input
          type="text"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setRoomName(e.target.value);
          }}
        ></input>
        <b>Room details:</b>
        <textarea
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
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
            setNoOfplayers(Number(e.target.value));
          }}
        >
          {playerAllowedArray.map((item) => {
            return <option key={item.index}>{item.value}</option>;
          })}
        </select>
        <button
          className={roomViewStyle.buttonStyle}
          onClick={() => {
            createRoom();
          }}
        >
          Create
        </button>
      </div>
    </ModelPopUp>
  );
};
