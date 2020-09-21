import React, {useEffect} from "react";
import {IconButton,Avatar} from "@material-ui/core";
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import MicIcon from '@material-ui/icons/Mic';
import './chatSheet.css'
import SearchOutlinedIcon from '@material-ui/icons/SearchOutlined';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import MoreVertIcon from "@material-ui/icons/MoreVert";
import {useParams} from "react-router-dom";
export default function ChatSheet() {
    let { id } = useParams();

    useEffect(()=>{
        getSalesman()
    },[])

    const getSalesman = () => {
        let url = 'http://localhost:5000/salesman/get'
        fetch(url, {
            method: 'POST',
            body: JSON.stringify({shopkeeperId: localStorage.getItem('shopKeeper'),salesmanId:id}),
            headers: {
                "content-type": "application/json",

            }
        }).then((data) => {
            data.json().then((response) => {
                console.log(response, 'response');
            })


        })
            .catch((error) => {
                console.log(error);
                console.log('error is running');


            });
    }



    return(
        <div className="chatSheet">
            <div className="chat_header">
                <Avatar/>
                <div className="chat_headerInfo">
                    <h3>{id}</h3>
                    <p>Last seen at..</p>
                </div>
                <div className="chat_headerRight">
                    <IconButton>
                        <SearchOutlinedIcon/>
                    </IconButton>
                    <IconButton>
                        <AttachFileIcon/>
                    </IconButton>
                    <IconButton>
                        <MoreVertIcon/>
                    </IconButton>
                </div>
            </div>
            <div className="chat_body2">
                <p className='chat_message'>
                    <span className="chat_name">Huzaifa</span>
                    This is a message
                    <span className="chat_timestamp">{new Date().toLocaleString()}</span>
                </p>
                <p className='chat_message chat_receiver'>
                    <span className="chat_name">Huzaifa</span>
                    This is a message
                    <span className="chat_timestamp">{new Date().toLocaleString()}</span>
                </p>
                <p className='chat_message'>
                    <span className="chat_name">Huzaifa</span>
                    This is a message
                    <span className="chat_timestamp">{new Date().toLocaleString()}</span>
                </p>
                <p className='chat_message chat_receiver'>
                    <span className="chat_name">Huzaifa</span>
                    This is a message
                    <span className="chat_timestamp">{new Date().toLocaleString()}</span>
                </p>
                <p className='chat_message chat_receiver'>
                    <span className="chat_name">Huzaifa</span>
                    This is a message
                    <span className="chat_timestamp">{new Date().toLocaleString()}</span>
                </p>

            </div>
            <div className="chat_footer">
                <InsertEmoticonIcon fontSize='large'/>
                <form>
                    <input placeholder='Type a message' type="text"/>
                    <button type="submit">Send a message</button>
                </form>
                <MicIcon fontSize='large'/>
            </div>

        </div>
    )
}