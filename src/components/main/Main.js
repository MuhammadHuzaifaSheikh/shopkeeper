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
import {

    Route,
    Switch,
    useRouteMatch
} from "react-router-dom";
import {IconButton} from "@material-ui/core";
import {Edit} from "@material-ui/icons";
function Main (){
    let {path} = useRouteMatch();
    const [shopkeeperInformation, setShopkeeperInformation] = useState('');
    const [salesman, setSalesman] = useState('');

useEffect(()=>{
    getShopkeeperInfo()
    getSalesman()
},[])



    const getShopkeeperInfo =()=>{
        let url = 'http://localhost:5000/shopkeeper/get'
        fetch(url, {
            method: 'POST',
            body: JSON.stringify({shopkeeperId:localStorage.getItem('shopKeeper')}),
            headers: {
                "content-type": "application/json",

            }
        }).then((data) => {
            data.json().then((response) => {
                console.log('shopkeeper',response);
                setShopkeeperInformation(response.data)


            })


        })
            .catch((error) => {
                console.log(error);
                console.log('error is running');


            });
    }

    const getSalesman=()=>{
        let url = 'http://localhost:5000/salesman/get'
        fetch(url, {
            method: 'POST',
            body: JSON.stringify({shopkeeperId: localStorage.getItem('shopKeeper'),}),
            headers: {
                "content-type": "application/json",

            }
        }).then((data) => {
            data.json().then((response) => {
                console.log(response,'response');
                setSalesman(response.data)
            })


        })
            .catch((error) => {
                console.log(error);
                console.log('error is running');


            });
    }

        return(
            <div>
                    <Switch>
                        <Route path={`${path}/chat`}>
                            <Chat  shopkeeperinfo={shopkeeperInformation}/>
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
                            <MyHistory  shopkeeperinfo={shopkeeperInformation}/>
                        </Route>

                    </Switch>


            </div>
        )

}

export default Main