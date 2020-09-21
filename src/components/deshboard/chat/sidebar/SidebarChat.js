import React from "react";
import {Avatar} from "@material-ui/core";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import {useHistory, useRouteMatch} from "react-router-dom";
export default function SidebarChat({item}) {
    let {path, url} = useRouteMatch();
    let history = useHistory();

    return(

        <div>
            {/*<Avatar/>*/}
            {/*<div className="sidebarChat_info">*/}
                {/*<h2>{name}</h2>*/}
                {/*<p>This is the last chat</p>*/}
                <List component="nav" aria-label="main mailbox folders">
                    <ListItem
                        onClick={()=>history.push(`${url}/`+item.salesmanId)}
                        button
                    >
                        <ListItemIcon>
                            <Avatar />
                        </ListItemIcon>
                        <ListItemText style={{textTransform:'capitalize'}}  primary={item.name} />

                    </ListItem>

                </List>
            {/*</div>*/}
        </div>
    )
}