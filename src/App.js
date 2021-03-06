import React, {useEffect} from "react";
import Dashboard from "./components/deshboard/Dashboard";
import SignIn from "./components/auth/shopKeeper/SignIn";
import SignUp from "./components/auth/shopKeeper/SignUp";
import Error from "./components/errors/ErrorPage";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect

} from "react-router-dom";


export default function App() {


    return (
                <Router>
                <Switch>
                    <Route  path="/signup" render={() => {
                        return localStorage.getItem('shopKeeper') ? <Redirect to={'/dashboard'}/> : <SignUp/>
                    }}>
                    </Route>
                    <Route path="/signin" render={() => {
                        return localStorage.getItem('shopKeeper') ? <Redirect to={'/dashboard'}/> : <SignIn/>
                    }}>
                    </Route>
                    <Route path="/dashboard" render={() => {
                        return localStorage.getItem('shopKeeper') ? <Dashboard/> : <Redirect to={'/signin'}/>
                    }}>
                    </Route>

                    <Route exact path="/" render={() => {
                        return localStorage.getItem('shopKeeper') ?<Redirect to={'/dashboard'} />:  <SignIn/>

                    }}>
                    </Route>
                    <Route  path="*" render={() => {
                        return   <Error/>

                    }}>
                    </Route>
                </Switch>
                </Router>



    );
}
