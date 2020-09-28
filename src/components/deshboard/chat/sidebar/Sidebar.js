import React, {useEffect, useState} from "react";
import './sidebar.css'
import SidebarChat from "./SidebarChat";
import SearchOutlinedIcon from '@material-ui/icons/SearchOutlined';
import ChatIcon from '@material-ui/icons/Chat';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import {IconButton, Avatar, Typography} from "@material-ui/core";
import DonutLargeOutlinedIcon from '@material-ui/icons/DonutLargeOutlined';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import {useRouteMatch, useHistory} from "react-router-dom";
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import CloseIcon from '@material-ui/icons/Close';
import {withStyles} from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import Conversation from "../conversation";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
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


export default function Sidebar() {
    let ids = []
    let history = useHistory();
    let {path} = useRouteMatch();


    const [salesman, setSalesman] = useState([])
    const [open, setOpen] = useState(false);
    const [conversation, setConversation] =useState([]);
    const [userDetail, setUserDetail] =useState([]);
    const [userIds, setUserIds] =useState([]);

    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    useEffect(function () {
        getSalesman()
        getConversation()
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
                response.data.forEach((item) => {
                    item.isFriend = false
                })
                setSalesman(response.data)
            })


        })
            .catch((error) => {
                console.log(error);
                console.log('error is running');


            });
    }


    function addConversation() {



        let conversation = {
            members: ids
        }

        let url = 'http://localhost:5000/conversation/add'
        fetch(url, {
            method: 'POST',
            body: JSON.stringify(conversation),
            headers: {
                "content-type": "application/json",

            }
        }).then((data) => {data.json().then((response) => {
                history.push(`${path}/${response.data._id}`)

            })
        }).catch((error) => {
                console.log(error);
                console.log('error is running');


            });
    }

    function getConversation() {
        let conversation = {
            members:{ $in: [ localStorage.getItem('shopKeeper')] }
        }

        let url = 'http://localhost:5000/conversation/get'
        fetch(url, {
            method: 'POST',
            body: JSON.stringify(conversation),
            headers: {
                "content-type": "application/json",

            }
        }).then((data) => {
            data.json().then((response) => {
                setConversation(response.data)
                response.data.forEach((item,index)=>{
                    item.members.forEach((v,i)=>{
                        if (v!==localStorage.getItem('shopKeeper')){
                            userIds.push( {salesmanId:v})

                        }
                        // getUserDetail()


                    })

                })

            })


        })
            .catch((error) => {
                console.log(error);
                console.log('error is running');

            });
    }


    function getUserDetail() {


        let filter = {
            $or: userIds,
        };
        console.log('filter',filter);
        let url = 'http://localhost:5000/salesman/salesmanDetail'
        fetch(url, {
            method: 'POST',
            body: JSON.stringify(filter),
            headers: {
                "content-type": "application/json",

            }
        }).then((data) => {data.json().then((response) => {
                setUserDetail(response.data)
        })}).catch((error) => {
                console.log(error);
                console.log('error is running');


            });

        conversation.forEach((item)=>{
            item.userDetail=userDetail



        })
        console.log('user detail',conversation);

    }



    function isFriend(id, bollean) {
        ids = [localStorage.getItem('shopKeeper')]

        for (var i = 0; i > ids.length; i++) {
            if (ids[i] === id) {
                // ids[i].isFriend = false
                return;
                break;

            }

        }


        ids.push(id)
        addConversation()

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
                    // console.log(conversation);
                    return <Conversation key={index}  item={item}/>
                })}
            </div>

            <Dialog maxWidth='md' onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
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
        </div>
    )
}