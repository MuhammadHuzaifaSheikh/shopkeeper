import React, {useEffect} from "react";
import {Avatar,IconButton} from "@material-ui/core";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import {useHistory, useRouteMatch} from "react-router-dom";
import PersonAddIcon from '@material-ui/icons/PersonAdd';

export default function Conversation({item}) {
    let {path, url} = useRouteMatch();
    let history = useHistory();

    useEffect(()=>{
        console.log(item);
    },[])

    return(

        <div>

            <List component="nav" aria-label="main mailbox folders">
                <ListItem
                    onClick={()=>history.push(`${url}/`+item.conversationId)}
                    button
                >
                    <ListItemIcon> <Avatar src={item.photoUrl} /></ListItemIcon>
                    <div>
                    <ListItemText style={{textTransform:'capitalize'}}  primary={item.name} />
                    <ListItemText style={{color:'grey',fontSize:'10px'}}  primary={'last message...'} />
                    </div>
                </ListItem>


            </List>
        </div>
    )
}