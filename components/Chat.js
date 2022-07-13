import { useEffect, useState } from "react";
import {Moralis,user} from "moralis"
export default function Chat(props){
    const [chatId,setChatId] = useState(null);
    useEffect(()=>{
      Moralis.initialize("pzWwcygf5CVZ2MA3XEgqxq8snizI54n4pyozkwHU");
      Moralis.serverURL = "https://g7ywhu8ocsfc.usemoralis.com:2053/server";
        setChatId(props.chatId)
        console.log(chatId)
        init()
        getHistory()
    },[chatId])
    async function init(){
        let query = new Moralis.Query('Message');
        let subscription = await query.subscribe();

        const historyList = document.getElementById("historyList");

        subscription.on('create', (object) => {
          if(object.get("group") == chatId){
            var listItem = document.createElement('li');
            listItem.innerHTML = object.get("sender") + " says:<br>"+object.get("text")+"<br>"
            historyList.appendChild(listItem);
          }
        });
      }

    async function getHistory(){
        
        const Message = Moralis.Object.extend("Message");
        const query = new Moralis.Query(Message);

        query.equalTo("group",chatId)
        const results = await query.find();

        const historyList = document.getElementById("historyList");

        for (let i = 0; i < results.length; i++) {
          const object = results[i];
          var listItem = document.createElement('li');
          listItem.innerHTML = object.get("sender") + " says:<br>"+object.get("text")+"<br>"
          historyList.appendChild(listItem);
        }

    }

      

    async function sendMessage(){
        let user = Moralis.User.current();
        let message =  document.getElementById("chatInput").value;
        console.log(user)
        if(message && message.length>0){
          const Message = Moralis.Object.extend("Message");
          const m = new Message();
          m.set("sender",user.get("ethAddress"))
          m.set("text",message)
          m.set("group",chatId)

          m.save()

          console.log("sending " + message + " from " + user.get("ethAddress") + " in group " + chatId)
        }
    }

    return (
        <div>

        

            <p>CHAT</p>

            <div id="chatHistory">
            <ul id="historyList"></ul>
            </div>

            <input type="text" id="chatInput"/>
            <input type="button" value="Send Message" id="sendButton" onClick={sendMessage}/>

        </div>
    )
}