import {
  ReactChild,
  ReactChildren,
  useEffect,
  useReducer,
  useState,
} from "react";
import { useFetch } from "../../../Util/CustomHokks";
import { GameAction, IFGame, IFGameProps } from "../../../Util/Others";
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
export const CardView = (props: IFGameProps) => {
  const gameid = useState(props);
  return (
    <div
      onClick={() => {
        if (props.callBack) {
          props.callBack(props.gameData);
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
              gameData={item}
              callBack={(gameData: IFGame) => {
                console.log(gameData);
              }}
              key={item.gameid}
            >
              <div className={GameStyle.containerview}>
                <h4>
                  <b>Game name: {item.gamename}</b>
                </h4>
                <p>Game Details: {item.gamedesc}</p>
                <b>
                  {item.multiplayer ? (
                    <div>
                      Multiplayer:
                      <div>
                        <button onClick={() => {}}>Single Player</button>
                      </div>
                      <div>
                        <button onClick={() => {}}>MultiPlayer</button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      Single Player:
                      <button onClick={() => {}}>Single Player</button>
                    </div>
                  )}
                </b>
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
