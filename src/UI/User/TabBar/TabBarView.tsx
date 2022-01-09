import { useEffect, useReducer, useState } from "react";
import { sendData } from "../../../Util/dataService";
import {
  CallbackFunctionVariadic,
  GameAction,
  IFGame,
  LocalDataStorage,
} from "../../../Util/Others";
import TabBarStyle from "./TabBarStyle.module.css";
export interface IFTab {
  id: number;
  label: string;
}
export interface IFTabBarProps {
  tabs: Array<IFTab>;
  isLogin: boolean;
  callBack: CallbackFunctionVariadic;
}

// 1 for register
// 0 for login
// 2 for logout
export const TabBarView = (props: IFTabBarProps) => {
  const [isLogin, setisLogin] = useState(false);

  //logout user
  async function logOut() {
    const tokenData = {
      ACCESS_TOKEN: LocalDataStorage.getTokenFromCookie(`accessToken`),
    } as const;
    const result = await sendData(`http://localhost:4040/user/logout`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(tokenData),
    });
    if (result.logout) {
      LocalDataStorage.clearObject(`userData`);
      //hmmmmmmm need to improve
      props.callBack(2);
    }
  }
  useEffect(() => {
    setisLogin(props.isLogin);
  }, [props.isLogin, setisLogin]);
  return (
    <div className={TabBarStyle.tab}>
      {props.tabs.map((tab) => {
        return (
          <button
            key={tab.id}
            className={TabBarStyle.active}
            onClick={() => {
              props.callBack(tab.id);
            }}
          >
            {tab.label}
          </button>
        );
      })}
      {isLogin ? (
        <button
          onClick={() => {
            logOut();
          }}
        >
          Logout
        </button>
      ) : (
        <div>Login And play games</div>
      )}
    </div>
  );
};
