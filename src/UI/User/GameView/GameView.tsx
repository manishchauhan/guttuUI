import {
  ReactChild,
  ReactChildren,
  useEffect,
  useReducer,
  useState,
} from "react";
import { useFetch } from "../../../Util/CustomHokks";
import { GameAction, IFGame } from "../../../Util/Others";
import GameStyle from "./GameStyle.module.css";

const gameSelectReducer = (state: IFGame, action: GameAction) => {
  switch (action.type) {
    case "SELECT":
      console.log("game is selected", state);
      return { ...state };
    default:
      return state;
  }
};

// Card view for the game
export const CardView = (props: IFGame) => {
  const gameid = useState(props.gameid);
  return (
    <div
      onClick={() => {
        if (props.callBack) {
          props.callBack(props.gameid);
        }
      }}
      className={GameStyle.cardview}
    >
      {props.children}
    </div>
  );
};

export const GameView = () => {
  const [data, loading] = useFetch<IFGame>(
    `http://localhost:4040/user/fungames`
  );
  const [selectGameState, dispatchSelectGame] = useReducer(gameSelectReducer, {
    gameid: 0,
    gamename: ``,
    multiplayer: false,
  });
  return (
    <div>
      {!loading ? (
        data.map((item) => {
          return (
            <CardView
              gameid={item.gameid}
              callBack={(id) => {
                console.log("game id", id);
              }}
              key={item.gameid}
            >
              <div className={GameStyle.containerview}>
                <h4>
                  <b>Game name: {item.gamename}</b>
                </h4>
                <p>Game Details: {item.gamedesc}</p>
                <b>Multiplayer: {item.multiplayer ? "Yes" : "No"}</b>
              </div>
            </CardView>
          );
        })
      ) : (
        <div>Loading data...</div>
      )}
    </div>
  );
};
