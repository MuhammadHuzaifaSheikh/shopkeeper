import React, {useEffect, useState} from "react";
import {Avatar, CircularProgress, Dialog, DialogContent, Typography} from "@material-ui/core";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import {useHistory, useRouteMatch} from "react-router-dom";

export default function Conversation({item,onlineUsers}) {
    let {url} = useRouteMatch();
    let history = useHistory();
    const [userDetail, setUserDetail] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);


    useEffect(() => {
        item.members.forEach((v, i) => {
            if (v !== localStorage.getItem('shopKeeper')) {
                getUserDetail(v)

            }


        })
    }, [])


    function getUserDetail(id) {
        setOpenDialog(true)

        let filter = {
            salesmanId: id
        };
        let url = 'http://localhost:5000/salesman/getSalesman'
        fetch(url, {
            method: 'POST',
            body: JSON.stringify(filter),
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


    return (

        <div>
            <List component="nav" aria-label="main mailbox folders">
                <ListItem onClick={() => history.push(`${url}/${item._id}`)} button>
                    <ListItemIcon> <Avatar src={userDetail.photoUrl}/></ListItemIcon>
                    <div>
                        <ListItemText style={{textTransform: 'capitalize'}} primary={userDetail.name}/>
                        <ListItemText style={{color: 'grey', fontSize: '10px'}} primary={'last message...'}/>
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