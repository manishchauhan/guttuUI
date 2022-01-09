import { lazy, Suspense, useReducer, useState } from "react";
import { useFetch } from "../../../Util/CustomHokks";
import { GameAction, IFGame, IFGameProps } from "../../../Util/Others";
import { IFGameAreaProps } from "../GameView/GameArea";
import GameStyle from "./GameStyle.module.css";

/* Reducer */
const gameSelectReducer = (state: IFGame, action: GameAction) => {
  switch (action.type) {
    case "SELECT":
      console.log("game is selected", state);
      return { ...state };
    default:
      return state;
  }
};

/*
  Game card view
*/
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

/*

/*
  GameView 
*/
let GameAreaView: React.FunctionComponent<IFGameAreaProps>;
export const GameView = () => {
  const [data, loading] = useFetch<IFGame>(
    `http://localhost:4040/user/fungames`
  );
  // select a single player game

  function selectSinglePlayerGame() {
    if (!isGameSelected) {
      setiisGameSelected(true);
      GameAreaView = lazy(() =>
        import("../GameView/GameArea").then((module) => ({
          default: module.GameArea,
        }))
      );
    }
  }

  // select a multiplayer game

  function selectMultiPlayerGame() {
    if (!isGameSelected) {
      setiisGameSelected(true);
      GameAreaView = lazy(() =>
        import("../GameView/GameArea").then((module) => ({
          default: module.GameArea,
        }))
      );
    }
  }
  const [isGameSelected, setiisGameSelected] = useState(false);
  const [selectGameState, dispatchSelectGame] = useReducer(gameSelectReducer, {
    gameid: 0,
    gamename: ``,
    multiplayer: false,
  });
  return (
    <div>
      {isGameSelected ? (
        <Suspense fallback={<div>Loading view</div>}>
          <GameAreaView
            onBack={() => {
              setiisGameSelected(false);
            }}
          ></GameAreaView>
        </Suspense>
      ) : (
        <div>
          <b>Select a game to play</b>
        </div>
      )}
      {!isGameSelected && (
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
                            <button
                              onClick={() => {
                                selectSinglePlayerGame();
                              }}
                            >
                              Single Player
                            </button>
                          </div>
                          <div>
                            <button
                              onClick={() => {
                                selectMultiPlayerGame();
                              }}
                            >
                              MultiPlayer
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          Single Player:
                          <button
                            onClick={() => {
                              selectSinglePlayerGame();
                            }}
                          >
                            Single Player
                          </button>
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
      )}
    </div>
  );
};
