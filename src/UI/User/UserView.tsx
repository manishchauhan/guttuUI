import { useState } from "react"
import { sendData } from "../../Util/dataService";
import { IFTab, TabBarView } from "./TabBar/TabBarView";

//css only
import UserViewStyle from "./UserView.module.css";
//Not needed at global state
export interface IFUser
{
    UserId?:number;
    UserName:string,
    Password:string,
    Email:string
}


// Add Login view
export const LoginView=()=>{
    return <div className={UserViewStyle.loginViewhidden}>
        <span>Login view</span>
        <div>User name:<input type="text"></input></div>
        <div>Password:<input type="text"></input></div>
        <div><button onClick={()=>{
            console.log("some login try");
        }}>Login</button></div>
    </div>
}
//tab data
const tabArray:Array<IFTab>=[
    {id:0,label:"Login"},
    {id:1,label:"Register"}
] ;


// User View Register a new User
export const RegisterView=()=>{
    const [UserName,setUserName]=useState(``);
    const [Password,setPassword]=useState(``);
    const [Email,setEmail]=useState(``);
    function submitData()
    {
       const user={UserName:UserName,Password:Password,Email:Email};
       sendData(`http://localhost:4040/user/add`,{
        method: "POST",
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify(user)
      }).then((data)=>{
          console.log("the data is",data)
      }).catch(e=>{
          console.log(e);
      })
    }
    return (
        <div className={UserViewStyle.registerViewshow}>
        <div>User Name : <input type="text" onChange={(e:React.ChangeEvent<HTMLInputElement>)=>{
            setUserName(e.target.value);

        }}></input></div>
        <div>Password : <input type="text" onChange={(e:React.ChangeEvent<HTMLInputElement>)=>{
              setPassword(e.target.value);

        }} ></input></div>
        <div>Email : <input type="text" onChange={(e:React.ChangeEvent<HTMLInputElement>)=>{
            setEmail(e.target.value)
        }}></input></div>
        <div><button onClick={()=>{
            submitData()
        }}>Register</button></div>
    </div>
    )
}
//User View Combine mutiple views
export const UserView=()=>{
   
    return <div>
        <TabBarView tabs={tabArray}></TabBarView>
        <LoginView></LoginView>
        <RegisterView></RegisterView>
    </div>
}


