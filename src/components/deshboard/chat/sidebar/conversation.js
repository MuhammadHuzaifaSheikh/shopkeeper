import React, {useEffect, useState} from "react";
import {Avatar, CircularProgress, Dialog, DialogContent, Typography} from "@material-ui/core";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import {useHistory, useRouteMatch} from "react-router-dom";
import Badge from '@material-ui/core/Badge';
import {withStyles } from '@material-ui/core/styles';
const StyledBadge = withStyles((theme) => ({
    badge: {
        backgroundColor: '#44b700',
        color: '#44b700',
        boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
        '&::after': {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            animation: '$ripple 1.2s infinite ease-in-out',
            border: '1px solid currentColor',
            content: '""',
        },
    },
    '@keyframes ripple': {
        '0%': {
            transform: 'scale(.8)',
            opacity: 1,
        },
        '100%': {
            transform: 'scale(2.4)',
            opacity: 0,
        },
    },
}))(Badge);

export default function Conversation({item,onlineUsers,socket}) {
    let {url} = useRouteMatch();
    let history = useHistory();
    const [userDetail, setUserDetail] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [lastMessage, setLastMesage] = useState('');

    useEffect(()=>{
        socket.on('lastMessage/'+item?._id,newData=>{
            console.log(newData);
            console.log(userDetail);
            if (item?._id===newData?._id){
                item.lastMessage=newData?.lastMessage
            }
            setLastMesage(newData);
        })
    },[lastMessage])

    useEffect(() => {
        item.members.forEach((v, i) => {
            if (v !== localStorage.getItem('shopKeeper')) {
                getUserDetail(v)
            }
        })
    }, [item.members,onlineUsers])


    function getUserDetail(id) {
        if (id===localStorage.getItem('shopKeeper')){
            let url = 'https://salesman-back.herokuapp.com/shopkeeper/get'
            fetch(url, {
                method: 'POST',
                body: JSON.stringify({shopkeeperId:id}),
                headers: {
                    "content-type": "application/json",
                }
            }).then((data) => {data.json().then((response) => {
                setUserDetail(response.data)


            })}).catch((error) => {
                console.log(error);
                console.log('error is running');

            });
        }

        else {
            let url = 'https://salesman-back.herokuapp.com/salesman/getSalesman'
            fetch(url, {
                method: 'POST',
                body: JSON.stringify({   salesmanId: id}),
                headers: {
                    "content-type": "application/json",

                }
            }).then((data) => {
                data.json().then((response) => {
                    setUserDetail(response.data)
                    setOpenDialog(false)

                })
            }).catch((error) => {
                console.log(error);
                console.log('error is running');
            });
        }


    }

    function truncate(str, n) {
        return (str?.length > n) ? str.substr(0, n - 1) + '...' : str;
    }

    return (

        <div>
            <List  style={{borderBottom:'1px solid #f3f3f3'}} component="nav" aria-label="main mailbox folders">
                <ListItem onClick={() => history.push(`${url}/${item._id}`)} button>
                    <ListItemIcon>
                        {
                            userDetail.isOnline?
                                <StyledBadge
                                    overlap="circle"
                                    anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'right',
                                    }}
                                    variant="dot"
                                >
                                    <Avatar src={userDetail.photoUrl?userDetail.photoUrl:''}/>
                                </StyledBadge>
                                :
                                <Avatar src={userDetail.photoUrl?userDetail.photoUrl:''}/>
                        }

                    </ListItemIcon>
                    <div>
                        <ListItemText style={{textTransform: 'capitalize'}} primary={userDetail.name}/>
                        <ListItemText style={{color: 'grey', fontSize: '10px'}} primary={truncate(item?.lastMessage, 20)}/>
                    </div>

                </ListItem>
            </List>
            <Dialog
                fullWidth
                open={openDialog}
                onClose={() => setOpenDialog(openDialog)}
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
