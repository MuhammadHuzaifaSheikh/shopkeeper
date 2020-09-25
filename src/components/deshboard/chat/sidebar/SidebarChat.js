import React, {useEffect, useState} from "react";
import {Avatar,IconButton} from "@material-ui/core";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import {useHistory, useRouteMatch} from "react-router-dom";
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import PersonAddDisabledIcon from '@material-ui/icons/PersonAddDisabled';
export default function SidebarChat({item,ifFriend,ifFriendBollean}) {
    return(
        <div>
                <List style={{display:'flex',justifyContent:'row',alignItems:'center'}} component="nav" aria-label="main mailbox folders">
                    <ListItem
                    >
                        <ListItemIcon> <Avatar /></ListItemIcon>
                        <ListItemText style={{textTransform:'capitalize'}}  primary={item.name} />

                    </ListItem>
                    <IconButton onClick={()=>ifFriend(item.salesmanId,ifFriendBollean)}>    {  ifFriendBollean?<PersonAddIcon style={{color:'#4caf50'}}  />:<PersonAddDisabledIcon />}     </IconButton>


                </List>
        </div>
    )
}