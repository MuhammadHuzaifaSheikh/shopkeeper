import React, {Component} from "react";
import Chat from "../deshboard/chat/Chat";
import AddProducts from "../deshboard/products/AddProduts";
import AllProducts from "../deshboard/products/AllProducts";
import HireSelsMen from "../deshboard/selsMen/HireSelsMen";
import SelsMenDetail from "../deshboard/selsMen/SelsMenDetail";
import EditProduct from "../deshboard/products/EditProduct";
import EditSalesman from "../deshboard/selsMen/EditSalesman";
import MyHistory from "../deshboard/history/income/myHistory";
import {Route, Switch} from "react-router-dom";
import io from 'socket.io-client';
const socket = io('http://localhost:5000');
// function Main() {
//     let '/dashboard' = useRouteMatch();
//     const [shopkeeperInformation, setShopkeeperInformation] = useState('');
//     const [salesman, setSalesman] = useState('');
//     const [onlineUsers, setOlineUsers] = useState('');
//     useEffect(() => {
//         getShopkeeperInfo()
//         getSalesman()
//     }, [])
//     const getShopkeeperInfo = () => {
//         let url = 'http://localhost:5000/shopkeeper/get'
//         fetch(url, {
//             method: 'POST',
//             body: JSON.stringify({shopkeeperId: localStorage.getItem('shopKeeper')}),
//             headers: {
//                 "content-type": "application/json",
//
//             }
//         }).then((data) => {
//             data.json().then((response) => {
//                 setShopkeeperInformation(response.data)
//
//
//             })
//
//
//         })
//             .catch((error) => {
//                 console.log(error);
//                 console.log('error is running');
//
//
//             });
//     }
//     const getSalesman = () => {
//         let url = 'http://localhost:5000/salesman/get'
//         fetch(url, {
//             method: 'POST',
//             body: JSON.stringify({shopkeeperId: localStorage.getItem('shopKeeper'),}),
//             headers: {
//                 "content-type": "application/json",
//
//             }
//         }).then((data) => {
//             data.json().then((response) => {
//                 setSalesman(response.data)
//             })
//
//
//         })
//             .catch((error) => {
//                 console.log(error);
//                 console.log('error is running');
//
//
//             });
//     }
//     useEffect(() => {
//         console.log(socket.connected);
//         socket.emit('roomName', localStorage.getItem('shopKeeper'));
//         socket.emit('login' , {userId: localStorage.getItem('shopKeeper')});
//         socket.on('onlineStatusId' , (id) => {
//             console.log('online', id);
//             setOlineUsers(id)
//         })
//         socket.on('onlineStatusIdDisconnect', (id) => {
//             console.log('disconnect', id);
//             setOlineUsers(id)
//         })
//     }, [])
//
//
//     return (
//         <div>
//             <Switch>
//                 <Route path={`$'/dashboard'/chat`}>
//                     <Chat onlineUsers={onlineUsers} shopkeeperinfo={shopkeeperInformation}/>
//                 </Route>
//                 <Route exact path={`$'/dashboard'/hiresalesmen`}>
//                     <HireSelsMen/>
//                 </Route>
//                 <Route exact path={`$'/dashboard'/selsmendetail`}>
//                     <SelsMenDetail/>
//                 </Route>
//                 <Route exact path={`$'/dashboard'/addproducts`}>
//                     <AddProducts/>
//                 </Route>
//                 <Route exact path={`$'/dashboard'/allproducts`}>
//                     <AllProducts/>
//                 </Route>
//                 <Route exact path={`$'/dashboard'/editproduct/:id`}>
//                     <EditProduct/>
//                 </Route>
//                 <Route exact path={`$'/dashboard'/editsalesman/:id`}>
//                     <EditSalesman/>
//                 </Route>
//                 <Route exact path={`$'/dashboard'`}>
//                     <MyHistory shopkeeperinfo={shopkeeperInformation}/>
//                 </Route>
//
//             </Switch>
//
//
//         </div>
//     )
//
// }
//
// export default Main


export  default class Main extends Component{

    state={
        onlineUsers:[],
        shopkeeperInformation:'',
        salesmanInformation:[],
        room:'',

    }
    componentDidMount() {
        let url = 'http://localhost:5000/salesman/get'
        fetch(url, {
            method: 'POST',
            body: JSON.stringify({salesmanId: localStorage.getItem('salesman'),}),
            headers: {
                "content-type": "application/json",

            }
        }).then((data) => {data.json().then((response) => {if (response.data) {

            this.setState({salesmanInformation:response.data[0]})
            this.getShopkeeperInfo(response.data.shopkeeperId)
        }}).catch((error) => {console.log(error);console.log('error is running');});
        })
        if (localStorage.getItem('shopKeeper')) {
            io.connect('http://localhost:5000', {
                transports: ['websocket'],
                query: 'userID=' + localStorage.getItem('shopKeeper') + '&companyID=' + localStorage.getItem('shopKeeper')
            })
        }
    }
    componentWillMount() {
        socket.on('isOnline/' + localStorage.getItem('shopKeeper'), data => {
            console.log(data);
            this.setState({onlineUsers: data})
        })
    }

    getShopkeeperInfo (shopkeeperId) {
        let url = 'http://localhost:5000/shopkeeper/get'
        fetch(url, {
            method: 'POST',
            body: JSON.stringify({shopkeeperId}),
            headers: {
                "content-type": "application/json",

            }
        }).then((data) => {
            data.json().then((response) => {
                this.setState({shopkeeperInformation:response.data})
                localStorage.setItem("shopKeeper", response.data.shopkeeperId);

            })


        })
            .catch((error) => {
                console.log(error);
                console.log('error is running');


            });
    }


    render() {
        let {onlineUsers,shopkeeperInformation}=this.state;
            return (
        <div>
            <Switch>
                <Route path={`/dashboard/chat`}>
                    <Chat socket={socket}  onlineUsers={onlineUsers} shopkeeperinfo={shopkeeperInformation}/>
                </Route>
                <Route exact path={`/dashboard/hiresalesmen`}>
                    <HireSelsMen/>
                </Route>
                <Route exact path={`/dashboard/selsmendetail`}>
                    <SelsMenDetail/>
                </Route>
                <Route exact path={`/dashboard/addproducts`}>
                    <AddProducts/>
                </Route>
                <Route exact path={`/dashboard/allproducts`}>
                    <AllProducts/>
                </Route>
                <Route exact path={`/dashboard/editproduct/:id`}>
                    <EditProduct/>
                </Route>
                <Route exact path={`/dashboard/editsalesman/:id`}>
                    <EditSalesman/>
                </Route>
                <Route exact path={`/dashboard`}>
                    <MyHistory shopkeeperinfo={shopkeeperInformation}/>
                </Route>

            </Switch>


        </div>
    )

    }
}
