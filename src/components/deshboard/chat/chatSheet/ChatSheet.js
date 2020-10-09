import React, {useEffect, useState} from "react";
import {IconButton, Avatar, CircularProgress, Typography} from "@material-ui/core";
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import MicIcon from '@material-ui/icons/Mic';
import './chatSheet.css'
import SearchOutlinedIcon from '@material-ui/icons/SearchOutlined';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import MoreVertIcon from "@material-ui/icons/MoreVert";
import {useParams} from "react-router-dom";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
export default function ChatSheet({getConversation,messages}) {
    let { id } = useParams();
    const [userDetal, setUserDetal] = useState([]);
    const [messageValue, setMessageValue] = useState('');
    const [openLoading, setOpenLoading] = useState(false);

    useEffect(()=>{

        getConversation(id)
            conversationDetail()

    },[id])

    function conversationDetail() {
        setOpenLoading(true)
        let conversation = {
            _id: id
        }

        let url = 'http://localhost:5000/conversation/getOne'
        fetch(url, {
            method: 'POST',
            body: JSON.stringify(conversation),
            headers: {
                "content-type": "application/json",

            }
        }).then((data) => {
            data.json().then((response) => {
                    response.data.members.forEach((v, i) => {
                        if (v !== localStorage.getItem('shopKeeper')) {
                            getUserDetail(v)
                        }

                        setOpenLoading(false)


                    })


            })


        })
            .catch((error) => {
                console.log(error);
                console.log('error is running');

            });
    }
    function getUserDetail(salesmanId) {
        let url = 'http://localhost:5000/salesman/getSalesman'
        fetch(url, {
            method: 'POST',
            body: JSON.stringify({salesmanId}),
            headers: {
                "content-type": "application/json",

            }
        }).then((data) => {
            data.json().then((response) => {
                setUserDetal(response.data)
            })


        })
            .catch((error) => {
                console.log(error);
                console.log('error is running');
            });
    }

    function sendMessage(e) {
        e.preventDefault()
        console.log(messageValue);
        let messageData={
            conversationId:id,
            senderId:localStorage.getItem('shopKeeper'),
            message:messageValue,
            messageTime:Date.now()
        }
        messages.push(messageData)


        let url = 'http://localhost:5000/messages/add'
        fetch(url, {
            method: 'POST',
            body: JSON.stringify(messageData),
            headers: {
                "content-type": "application/json",
            }
        }).then((data) => {
            data.json().then((response) => {
                console.log(response.data);
                messages.forEach((item,index)=>{
                    if (item===messageData){
                        messages.splice(index,1)
                    }
                })

            })


        })
            .catch((error) => {
                console.log(error);
                console.log('error is running');


            });
        setMessageValue('')
    }


    return(
        <div className="chatSheet">
            <div className="chat_header">
                {userDetal?
                    <>
                    <Avatar src={userDetal.photoUrl}/>
                    <div className="chat_headerInfo">
                        <h3>{userDetal.name}</h3>
                        <p>Last seen at..</p>
                    </div>
                    </>
                    :  <CircularProgress color="primary"/>
                }

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
                { messages.map((item,index)=>{
                    return(   <p key={index} className={`chat_message  ${item.senderId===localStorage.getItem('shopKeeper')?"chat_receiver":''}`}>
                        <span className="chat_name">Hamza</span>
                         {item.message}
                        <span className="chat_timestamp">{new Date(item.messageTime).toLocaleString()}</span>
                    </p>
                 )
                })}


            </div>
            <div className="chat_footer">
                <InsertEmoticonIcon fontSize='large'/>
                <form onSubmit={sendMessage}>
                    <input value={messageValue} onChange={(e)=>setMessageValue(e.target.value)} placeholder='Type a message' type="text"/>
                    <button type="submit">Send a message</button>
                </form>
                <MicIcon fontSize='large'/>
            </div>

            <Dialog
                fullWidth
                open={openLoading}
                onClose={() => setOpenLoading(openLoading)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description">
                <DialogContent style={{textAlign: "center", paddingTop: "30px"}}>
                    <CircularProgress color="primary"/>
                    <Typography>Loading</Typography>
                </DialogContent>
            </Dialog>

        </div>
    )
}