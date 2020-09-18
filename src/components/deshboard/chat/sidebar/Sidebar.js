import React from "react";
import './sidebar.css'
import SidebarChat from "./SidebarChat";
import SearchOutlinedIcon from '@material-ui/icons/SearchOutlined';
import ChatIcon from '@material-ui/icons/Chat';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import {IconButton,Avatar} from "@material-ui/core";
import DonutLargeOutlinedIcon from '@material-ui/icons/DonutLargeOutlined';
export default function Sidebar() {
    return(
        <div className='sidebar'>
            <div className='sidebar_header'>
                <Avatar/>
                <div className="sidebar_headerRight">
                    <IconButton>
                        <DonutLargeOutlinedIcon/>
                    </IconButton>
                    <IconButton>
                        <ChatIcon/>
                    </IconButton>
                    <IconButton>
                        <MoreVertIcon/>
                    </IconButton>
                </div>
            </div>
            <div className="sidebar_search">
                <div className="sidebar_searchContainer">
                    <SearchOutlinedIcon/>
                    <input placeholder='Search or start new chat' type="text"/>
                </div>

            </div>
            <div className="sidebar_chats">
                <SidebarChat/>
                <SidebarChat/>
                <SidebarChat/>
            </div>
        </div>
    )
}