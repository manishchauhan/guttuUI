import { lazy, Suspense, useEffect, useReducer, useState } from "react";
import { useFetch } from "../../../Util/CustomHokks";
import {
  GameAction,
  IFGame,
  IFGameProps,
  LocalDataStorage,
} from "../../../Util/Others";
import { IFGameAreaProps } from "../GameView/GameArea";
import { IFAuthData, IFUser } from "../UserView";
import GameStyle from "./GameStyle.module.css";
import { IFroomListData, RoomList } from "./rooms/roomList";

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

/* Reducer */
const gameSelectReducer = (state: IFroomListData, action: GameAction) => {
  switch (action.type) {
    case "SELECT":
      return { ...state };
    case "MULTIPLAYER":
      const newState: IFroomListData = {
        show: true,
        gameData: action.payload?.game,
        user: action.payload?.user,
      };

      return newState;
    default:
      return state;
  }
};

/*
  GameView 
*/
let GameAreaView: React.FunctionComponent<IFGameAreaProps>;
export const GameView = () => {
  const [data, loading] = useFetch<IFGame>(
    `http://localhost:4040/user/fungames`
  );
  const [isGameSelected, setiisGameSelected] = useState(false);
  const [selectGameState, dispatchSelectGame] = useReducer(gameSelectReducer, {
    show: false,
  });
  const [romListData, setromListData] = useState<IFroomListData>();
  // select a single player game

  function selectSinglePlayerGame(gameData: IFGame) {
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

  function selectMultiPlayerGame(gameData: IFGame) {
    const authData: IFAuthData = LocalDataStorage.getObject<IFAuthData>(
      "userData"
    ) as IFAuthData;
    const user: IFUser = {
      UserName: authData.user,
      Email: authData.email,
      UserId: authData.userid as number,
    };
    dispatchSelectGame({
      type: "MULTIPLAYER",
      payload: { game: gameData, user: user },
    });
  }

  return (
    <div>
      <RoomList
        show={selectGameState.show}
        user={selectGameState.user}
        gameData={selectGameState.gameData}
      ></RoomList>
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
                    // console.log(gameData);
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
                                selectSinglePlayerGame(item);
                              }}
                            >
                              Single Player
                            </button>
                          </div>
                          <div>
                            <button
                              onClick={async () => {
                                selectMultiPlayerGame(item);
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
                              selectSinglePlayerGame(item);
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
