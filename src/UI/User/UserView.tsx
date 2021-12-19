import { useEffect, useState } from "react"
import { sendData } from "../../Util/dataService";
import { IFTab, TabBarView } from "./TabBar/TabBarView";

//css only
import UserViewStyle from "./UserView.module.css";
//Not needed at global state
export interface IFUser
{
    UserId?:number;
    UserName?:string,
    Password?:string,
    Email?:string,
    pageState?:number
}


// Add Login view
export const LoginView=(props:IFUser)=>{
      const [userName,setuserName]=useState(``);
      const [passWord,setpassWord]=useState(``);
      const [pageState,setPageState]=useState(props.pageState);

      function  loginUser() {
          if(userName===`` || passWord===``)
          {
              console.log("username and password can't be empty");
              return;
          }
      }
      useEffect(()=>{
    
        setPageState(props.pageState)
       
    },[props.pageState])
    return <div className={pageState===0?UserViewStyle.loginViewshow:UserViewStyle.loginViewhidden
    }>
        <span>Login view</span>
        <div>User name:<input type="text" id="username" name="username" onChange={(e:React.ChangeEvent<HTMLInputElement>)=>{
            setuserName(e.target.value);
        }}></input></div>
        <div>Password:<input type="text" onChange={(e:React.ChangeEvent<HTMLInputElement>)=>{
            setpassWord(e.target.value);
        }}></input></div>
        <div><button onClick={()=>{
           loginUser();
        }}>Login</button></div>
    </div>
}
//tab data
const tabArray:Array<IFTab>=[
    {id:0,label:"Login"},
    {id:1,label:"Register"}
] ;


// User View Register a new User
export const RegisterView=(props:IFUser)=>{
    const [pageState,setPageState]=useState(props.pageState)
    const [UserName,setUserName]=useState(``);
    const [Password,setPassword]=useState(``);
    const [Email,setEmail]=useState(``);
    useEffect(()=>{
      
        setPageState(props.pageState)
 
    },[props.pageState])
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
        <div className={pageState===1?UserViewStyle.registerViewshow:UserViewStyle.registerViewhidden}>
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
export const UserView=(props:IFUser)=>{
    const [homePageState,setHomePageState]=useState(1);
    useEffect(()=>{
        setHomePageState(homePageState);
      
    },[homePageState])
    return <div>
        <TabBarView callBack={(id)=>{
          setHomePageState(id);
     
        }} tabs={tabArray}></TabBarView>
        <LoginView pageState={homePageState}></LoginView>
        <RegisterView  pageState={homePageState}></RegisterView>
    </div>
}


