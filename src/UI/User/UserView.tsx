import { useState } from "react"
import { sendData } from "../../Util/dataService";
//Not needed at global state
export interface User
{
    UserId?:number;
    UserName:string,
    Password:string,
    Email:string
}
// User View Register a new User
export const UserView=()=>{
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
        <div>
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