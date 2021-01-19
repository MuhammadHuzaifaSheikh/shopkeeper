import React, {useEffect, useState} from "react";
import './sidebar.css'
import SidebarChat from "./SidebarChat";
import SearchOutlinedIcon from '@material-ui/icons/SearchOutlined';
import ChatIcon from '@material-ui/icons/Chat';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import {IconButton, Avatar, Typography, CircularProgress} from "@material-ui/core";
import DonutLargeOutlinedIcon from '@material-ui/icons/DonutLargeOutlined';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import {useRouteMatch, useHistory} from "react-router-dom";
import Dialog from '@material-ui/core/Dialog';
import CloseIcon from '@material-ui/icons/Close';
import {withStyles} from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import Conversation from "./conversation";
import Pusher from "pusher-js";


const styles = (theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(2),
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
});
const DialogTitle = withStyles(styles)((props) => {
    const {children, classes, onClose, ...other} = props;
    return (
        <MuiDialogTitle disableTypography className={classes.root} {...other}>
            <Typography variant="h6">{children}</Typography>
            {onClose ? (
                <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
                    <CloseIcon/>
                </IconButton>
            ) : null}
        </MuiDialogTitle>
    );
});
const DialogContent = withStyles((theme) => ({
    root: {
        padding: theme.spacing(2),
    },
}))(MuiDialogContent);


export default function Sidebar({onlineUsers,socket}) {


    let ids = []
    let history = useHistory();
    let {path} = useRouteMatch();


    const [salesman, setSalesman] = useState([])
    const [open, setOpen] = useState(false);
    const [conversation, setConversation] = useState([]);
    const [userIds, setUserIds] = useState([]);
    const [openLoading, setOpenLoading] = useState(false);
    const [onlinePerson, setOnlinePerson] = useState([]);

    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };





    useEffect(()=>{
        console.log('onlineUsers',onlineUsers);
    },[onlineUsers])

    useEffect(()=>{
        const pusher = new Pusher('742bc87733a1b7fcf746', {
            cluster: 'ap3'
        });

        const channel = pusher.subscribe('conversation');
        channel.bind('add', (newData)=> {
            setConversation([...conversation,newData])
        });

        return ()=>{
            channel.unbind_all();
            channel.unsubscribe()
        }
    },[conversation])


    useEffect(function () {
        getUser()
        getConversation()
    }, [])


    function getUser() {

        let url = 'https://salesman-back.herokuapp.com/salesman/get'
        fetch(url, {
            method: 'POST',
            body: JSON.stringify({shopkeeperId:localStorage.getItem('shopKeeper')}),
            headers: {
                "content-type": "application/json",

            }
        }).then((data) => {
            data.json().then((response) => {
                setSalesman(response.data)
            })


        })
            .catch((error) => {
                console.log(error);
                console.log('error is running');
            });
    }

    function addConversation(id) {
        let conversationMatch = {
            $and: [
                {members: {$in: [id]}},
                {members: {$in: [localStorage.getItem('shopKeeper')]}}
            ],
        }

        let url2 = 'https://salesman-back.herokuapp.com/conversation/getForMatch'
        fetch(url2, {
            method: 'POST',
            body: JSON.stringify({queries: conversationMatch, addMember: ids}),
            headers: {"content-type": "application/json",}
        }).then((data) => {
            data.json().then((response) => {
                console.log(response);
                if (response.data) {
                    history.push(`${path}/${response.data._id}`)
                } else {
                    let conversationCond = {members: ids}
                    let url = 'https://salesman-back.herokuapp.com/conversation/add'
                    fetch(url, {
                        method: 'POST',
                        body: JSON.stringify(conversationCond),
                        headers: {"content-type": "application/json",}
                    }).then((data) => {
                        data.json().then((response) => {
                            history.push(`${path}/${response.data._id}`)
                        })
                    }).catch((error) => {
                        console.log(error);
                        console.log('error is running');
                    });
                }


            })
        }).catch((error) => {
            console.log(error);
            console.log('error is running');
        });


    }

    function getConversation() {
        // setOpenLoading(true)
        let conversation = {
            members: {$in: [localStorage.getItem('shopKeeper')]}
        }

        let url = 'https://salesman-back.herokuapp.com/conversation/get'
        fetch(url, {
            method: 'POST',
            body: JSON.stringify(conversation),
            headers: {
                "content-type": "application/json",

            }
        }).then((data) => {
            data.json().then((response) => {
                setConversation(response.data)
                response.data.forEach((item, index) => {
                    item.members.forEach((v, i) => {
                        if (v !== localStorage.getItem('shopKeeper')) {
                            userIds.push({salesmanId: v})

                        }
                        setOpenLoading(false)


                    })

                })

            })


        })
            .catch((error) => {
                console.log(error);
                console.log('error is running');

            });
    }


    function isFriend(id) {
        ids = [localStorage.getItem('shopKeeper')]
        ids.push(id)
        addConversation(id)

    }


    return (
        <div className='sidebar'>
            <div className='sidebar_header'>
                <Avatar/>
                <div className="sidebar_headerRight">
                    <IconButton>
                        <DonutLargeOutlinedIcon/>
                    </IconButton>
                    <Tooltip title="Chat">
                        <IconButton onClick={handleClickOpen}>
                            <ChatIcon/>
                        </IconButton>
                    </Tooltip>
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
                {conversation.map((item, index) => {
                    return <Conversation socket={socket} onlineUsers={onlineUsers} key={index} item={item}/>
                })}
            </div>

            <Dialog fullWidth maxWidth='md' onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
                <DialogTitle id="customized-dialog-title" onClose={handleClose}>
                    Users
                </DialogTitle>
                <DialogContent dividers>
                    {salesman.map((item, index) => {
                        return <Typography onClick={handleClose} key={index} gutterBottom> <SidebarChat
                            ifFriendBollean={item.isFriend} ifFriend={isFriend} item={item}/></Typography>

                    })}
                </DialogContent>

            </Dialog>
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
