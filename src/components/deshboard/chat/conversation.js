import React, {useEffect, useState} from "react";
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
    const [userDetail, setUserDetail] =useState([]);


    useEffect(()=>{
        console.log(item);
        item.members.forEach((v,i)=>{
            if (v!==localStorage.getItem('shopKeeper')){
                getUserDetail(v)

            }


        })
    },[])



    function getUserDetail(id) {


        let filter = {
            salesmanId:id
        };
        console.log('filter',filter);
        let url = 'http://localhost:5000/salesman/getSalesman'
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



    }



    return(

        <div>

            <List component="nav" aria-label="main mailbox folders">
                <ListItem
                    onClick={()=>     history.push(`${url}/${item._id}`)}

                    button
                >
                    <ListItemIcon> <Avatar src={userDetail.photoUrl} /></ListItemIcon>
                    <div>
                    <ListItemText style={{textTransform:'capitalize'}}  primary={userDetail.name} />
                    <ListItemText style={{color:'grey',fontSize:'10px'}}  primary={'last message...'} />
                    </div>
                </ListItem>


            </List>
        </div>
    )
}