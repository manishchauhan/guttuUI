import { useState } from "react";
import { ModelPopUp } from "../../Components/ModelDialog/PopUp";
import roomViewStyle from "./roomView.module.css";
export const RoomView = () => {
  const [roomName, setRoomName] = useState("");
  const [roomDetails, setRoomDetails] = useState("");
  const [imgFile, setImgFile] = useState<File>();
  const [numPlayers, setNumPlayers] = useState("");
  function createRoom() {
    console.log("room is created");
  }
  return (
    <ModelPopUp backgroundStyle="modal" contentStyle="content">
      <div className={roomViewStyle.contentClass}>
        <h1>Create a Room </h1>
        <b>Room name: </b>
        <input type="text"></input>
        <b>Room details:</b>
        <textarea></textarea>
        <b>Room Image:</b>
        <input type="file"></input>
        <b>Select Player Allowed:</b>
        <select></select>
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
