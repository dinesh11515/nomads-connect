import { useEffect } from "react";
import { useMoralis } from 'react-moralis';
export default function ChatCre(){
  const { authenticate, isAuthenticated, user, Moralis } = useMoralis()

    useEffect(()=>{
      Moralis.initialize("pzWwcygf5CVZ2MA3XEgqxq8snizI54n4pyozkwHU");
      Moralis.serverURL = "https://g7ywhu8ocsfc.usemoralis.com:2053/server";
        getGroupChats();
    },[])
    async function login() {
        let user = Moralis.User.current();
        if (!user) {
          user = await authenticate();
        }
        console.log("logged in user:", user);
      }
    async function logOut() {
        await Moralis.User.logOut();
        console.log("logged out");
      }
      async function newGroupChat(){
        let chatTitle = document.getElementById("group-name-text").value;
        const Chats = Moralis.Object.extend("Chats");
        const chat = new Chats();
        chat.set("title", chatTitle);
        chat.set("owner","0x625B892f34ACA436e1525e5405A8fb81eC5cc04de");
        chat.set("matcher","hi")
        chat.save();

        console.log("created chat with title " + chatTitle);
      }

    async function getGroupChats(){
        const Chats = Moralis.Object.extend("Chats");
        const query = new Moralis.Query(Chats);
        const results = await query.find();

        const roomList = document.getElementById("roomList");

        for (let i = 0; i < results.length; i++) {
          const object = results[i];
          console.log(object.get('title'));
          var listItem = document.createElement('li');
          listItem.innerHTML = "<a href='chat?id="+object.id+"'>"+object.get('title')+"</a>";
          roomList.appendChild(listItem);
        }

    }
    return (
        <div>

            <button id="btn-login" className="p-5" onClick={login}>Login</button>
            <button id="btn-logout" className="p-5" onClick={logOut}>Logout</button>


            <hr/>
            <p className="p-5">Create new group chat: </p>
            <input type="text" className="p-5" placeholder="Group name" id="group-name-text"/>
            <input type="button" className="p-5" value="Create" id="btn-new-group-chat" onClick={newGroupChat}/>
            <hr/>


            <p className="p-5">Join group chat</p>

            <div className="p-5" id="chatRooms">
            <ul id="roomList"></ul>
            </div>

            <hr/>

        </div>
    )
}