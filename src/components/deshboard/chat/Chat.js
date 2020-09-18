import React from "react";
import './chat.css'
import ChatSheet from "./chatSheet/ChatSheet";
import Sidebar from './sidebar/Sidebar'
export default function Chat (){
    return(
        <div className='chat'>
        <div className='chat_body'>
            <Sidebar/>
            <ChatSheet/>
        </div>
        </div>
    )
}