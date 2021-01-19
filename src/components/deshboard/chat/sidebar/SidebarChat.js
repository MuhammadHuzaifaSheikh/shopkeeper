import React from "react";
import {Avatar} from "@material-ui/core";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

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
export default function SidebarChat({item,ifFriend}) {
    return(
        <div>
                <List style={{display:'flex',justifyContent:'row',alignItems:'center'}} component="nav" aria-label="main mailbox folders">
                    <ListItem button onClick={()=> {
                        if (item.salesmanId){ifFriend(item.salesmanId)}
                        else if (item.salesmanId===undefined){ifFriend(localStorage.getItem('shopKeeper'))}                    }}>
                        <ListItemIcon>
                            {
                                item.isOnline?
                                    <StyledBadge
                                        overlap="circle"
                                        anchorOrigin={{
                                            vertical: 'bottom',
                                            horizontal: 'right',
                                        }}
                                        variant="dot"
                                    >
                                        <Avatar src={item.photoUrl?item.photoUrl:''}/>                                    </StyledBadge>
                                    :
                                    <Avatar src={item.photoUrl?item.photoUrl:''}/>                            }

                        </ListItemIcon>
                        <ListItemText style={{textTransform:'capitalize'}}  primary={item.name} />
                    </ListItem>


                </List>
        </div>
    )
}