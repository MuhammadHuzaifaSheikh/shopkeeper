import React, {useEffect, useState} from "react";
// import Chat from "./";
import Chat from "../deshboard/chat/Chat";
import AddProducts from "../deshboard/products/AddProduts";
import AllProducts from "../deshboard/products/AllProducts";
import HireSelsMen from "../deshboard/selsMen/HireSelsMen";
import SelsMenDetail from "../deshboard/selsMen/SelsMenDetail";
import EditProduct from "../deshboard/products/EditProduct";
import EditSalesman from "../deshboard/selsMen/EditSalesman";
import MyHistory from "../deshboard/history/income/myHistory";
import {Route, Switch, useRouteMatch} from "react-router-dom";
import io from 'socket.io-client';
const socket = io('http://localhost:5000');
function Main() {
    let {path} = useRouteMatch();
    const [shopkeeperInformation, setShopkeeperInformation] = useState('');
    const [salesman, setSalesman] = useState('');
    const [onlineUsers, setOlineUsers] = useState('');
    useEffect(() => {
        getShopkeeperInfo()
        getSalesman()
    }, [])
    const getShopkeeperInfo = () => {
        let url = 'http://localhost:5000/shopkeeper/get'
        fetch(url, {
            method: 'POST',
            body: JSON.stringify({shopkeeperId: localStorage.getItem('shopKeeper')}),
            headers: {
                "content-type": "application/json",

            }
        }).then((data) => {
            data.json().then((response) => {
                setShopkeeperInformation(response.data)


            })


        })
            .catch((error) => {
                console.log(error);
                console.log('error is running');


            });
    }
    const getSalesman = () => {
        let url = 'http://localhost:5000/salesman/get'
        fetch(url, {
            method: 'POST',
            body: JSON.stringify({shopkeeperId: localStorage.getItem('shopKeeper'),}),
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
    useEffect(() => {
        console.log(socket.connected);

        socket.emit('login', {userId: localStorage.getItem('shopKeeper')});

        socket.on('onlineStatusId', (id) => {
            console.log('online', id);
            setOlineUsers(id)


        })

        socket.on('onlineStatusIdDisconnect', (id) => {
            console.log('disconnect', id);
            setOlineUsers(id)


        })
    }, [])


    return (
        <div>
            <Switch>
                <Route path={`${path}/chat`}>
                    <Chat onlineUsers={onlineUsers} shopkeeperinfo={shopkeeperInformation}/>
                </Route>
                <Route exact path={`${path}/hiresalesmen`}>
                    <HireSelsMen/>
                </Route>
                <Route exact path={`${path}/selsmendetail`}>
                    <SelsMenDetail/>
                </Route>
                <Route exact path={`${path}/addproducts`}>
                    <AddProducts/>
                </Route>
                <Route exact path={`${path}/allproducts`}>
                    <AllProducts/>
                </Route>
                <Route exact path={`${path}/editproduct/:id`}>
                    <EditProduct/>
                </Route>
                <Route exact path={`${path}/editsalesman/:id`}>
                    <EditSalesman/>
                </Route>
                <Route exact path={`${path}`}>
                    <MyHistory shopkeeperinfo={shopkeeperInformation}/>
                </Route>

            </Switch>


        </div>
    )

}

export default Main