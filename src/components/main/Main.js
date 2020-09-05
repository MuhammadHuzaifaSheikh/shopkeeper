import React, {useState} from "react";
// import Chat from "./";
import Chat from "../deshboard/chat/Chat";
import AddProducts from "../deshboard/products/AddProduts";
import AllProducts from "../deshboard/products/AllProducts";
import Income from "../deshboard/income/Income";
import HireSelsMen from "../deshboard/selsMen/HireSelsMen";
import SelsMenDetail from "../deshboard/selsMen/SelsMenDetail";
import EditProduct from "../deshboard/products/EditProduct";
import EditSalesman from "../deshboard/selsMen/EditSalesman";
import MyHistory from "../deshboard/history/myHistory";
import {

    Route,
    Switch,
    useRouteMatch
} from "react-router-dom";
function Main (){
    let {path} = useRouteMatch();



        return(
            <div>
                    <Switch>
                        <Route exact path={`${path}/chat`}>
                            <Chat/>
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
                        <Route exact path={`${path}/income`}>
                            <Income/>
                        </Route>
                        <Route exact path={`${path}/history`}>
                            <MyHistory/>
                        </Route>

                    </Switch>


            </div>
        )

}

export default Main