import React from "react";
import './chat.css'
import ChatSheet from "./chatSheet/ChatSheet";
import Sidebar from './sidebar/Sidebar'
import {Route, Switch, useRouteMatch} from "react-router-dom";
import HireSelsMen from "../selsMen/HireSelsMen";
import SelsMenDetail from "../selsMen/SelsMenDetail";
import AddProducts from "../products/AddProduts";
import AllProducts from "../products/AllProducts";
import EditProduct from "../products/EditProduct";
import EditSalesman from "../selsMen/EditSalesman";
import MyHistory from "../history/income/myHistory";
export default function Chat (){
    let {path} = useRouteMatch();

    return(
        <div className='chat'>
        <div className='chat_body'>
            <Sidebar/>
            <Switch>
                <Route exact path={`${path}/:id`}>
                    <ChatSheet/>
                </Route>
            </Switch>

        </div>
        </div>
    )
}