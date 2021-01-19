import React, {useEffect, useState} from "react";
import './chat.css'
import ChatSheet from "./chatSheet/ChatSheet";
import Sidebar from './sidebar/Sidebar'
import {Route, Switch, useRouteMatch} from "react-router-dom";

export default function Chat ({onlineUsers,socket}){
    let {path} = useRouteMatch();
    const [messages, setMessages] = useState([]);
    const [conversationId, setConversationId] = useState('');
    const loadMessages = (id) => {
        setConversationId(id)
        let url = 'https://salesman-back.herokuapp.com/messages/get'
        fetch(url, {method: 'POST', body: JSON.stringify({conversationId: id}), headers: {"content-type": "application/json",}
        }).then((data) => {data.json().then((response) => {setMessages(response.data)})}).catch((error) => {console.log(error);console.log('error is running');});}
    useEffect(() => {
        socket.on('message/'+conversationId,newData=>{
            setMessages([...messages, newData]);
            let url = 'https://salesman-back.herokuapp.com/messages/update'
            fetch(url, {
                method: 'POST', body: JSON.stringify({_id:newData._id,messageSent:false,messageReceived:true,messageRead:false}), headers: {"content-type": "application/json",}
            }).then((data) => {
                data.json().then((response) => {})
            })
        })
    }, [messages])



    return(
        <div className='chat'>
        <div className='chat_body'>
            <Sidebar socket={socket} onlineUsers={onlineUsers} />
            <Switch>
                <Route exact path={`${path}/:id`}>
                    <ChatSheet socket={socket} messages={messages} getConversation={loadMessages}/>
                </Route>
                <Route exact path={`${path}`}>
                  <div className='chat_home'>
                      <h2>Chat</h2>
                      <img src="https://www.freepngimg.com/thumb/chat/1-2-chat-png-image.png" alt=""/>
                  </div>

                </Route>
            </Switch>

        </div>
        </div>
    )
}
