import React, {useEffect, useState} from "react";
import './chat.css'
import ChatSheet from "./chatSheet/ChatSheet";
import Sidebar from './sidebar/Sidebar'
import {Route, Switch, useRouteMatch} from "react-router-dom";
import Pusher from "pusher-js";

export default function Chat ({onlineUsers}){
    let {path} = useRouteMatch();
    const [messages, setMessages] = useState([]);
    const loadMessages = (id) => {
        let url = 'http://localhost:5000/messages/get'
        fetch(url, {
            method: 'POST',
            body: JSON.stringify({conversationId: id}),
            headers: {
                "content-type": "application/json",

            }
        }).then((data) => {
            data.json().then((response) => {
                setMessages(response.data)

            })


        })
            .catch((error) => {
                console.log(error);
                console.log('error is running');


            });
    }
    useEffect(()=>{
        const pusher = new Pusher('742bc87733a1b7fcf746', {
            cluster: 'ap3'
        });

        const channel = pusher.subscribe('message');
        channel.bind('insert', (newData)=> {
            setMessages([...messages,newData])
        });

       return ()=>{
            channel.unbind_all();
            channel.unsubscribe()
        }
    },[messages])


    return(
        <div className='chat'>
        <div className='chat_body'>
            <Sidebar onlineUsers={onlineUsers} />
            <Switch>
                <Route exact path={`${path}/:id`}>
                    <ChatSheet messages={messages} getConversation={loadMessages}/>
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