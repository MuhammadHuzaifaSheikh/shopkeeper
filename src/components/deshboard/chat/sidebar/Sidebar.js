import React, {useEffect, useState} from "react";
import './sidebar.css'
import SidebarChat from "./SidebarChat";
import SearchOutlinedIcon from '@material-ui/icons/SearchOutlined';
import ChatIcon from '@material-ui/icons/Chat';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import {IconButton,Avatar} from "@material-ui/core";
import DonutLargeOutlinedIcon from '@material-ui/icons/DonutLargeOutlined';
import {useRouteMatch,useHistory} from "react-router-dom";

export default function Sidebar() {


    const [salesman, setSalesman] = useState([])


    useEffect(function () {
        getSalesman()
    }, [])

    function getSalesman() {
        let url = 'http://localhost:5000/salesman/get'
        fetch(url, {
            method: 'POST',
            body: JSON.stringify({shopkeeperId: localStorage.getItem('shopKeeper'),}),
            headers: {
                "content-type": "application/json",

            }
        }).then((data) => {
            data.json().then((response) => {
                console.log(response,'response');
                setSalesman(response.data)
            })


        })
            .catch((error) => {
                console.log(error);
                console.log('error is running');


            });
    }

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
                    <SearchOutlinedIcon fontSize='large'/>
                    <input placeholder='Search or start new chat' type="text"/>
                </div>

            </div>
            <div className="sidebar_chats">
                {salesman.map((item,index)=>{
                  return  <SidebarChat item={item}/>
                })}

            </div>
        </div>
    )
}