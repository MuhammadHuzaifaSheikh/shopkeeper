import React from "react";
import Dashboard from "./components/deshboard/Dashboard";
import SignIn from "./components/auth/shopKeeper/SignIn";
import SignUp from "./components/auth/shopKeeper/SignUp";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect

} from "react-router-dom";

// Since routes are regular React components, they
// may be rendered anywhere in the app, including in
// child elements.
//
// This helps when it's time to code-split your app
// into multiple bundles because code-splitting a
// React Router app is the same as code-splitting
// any other React app.

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
                </Switch>
                </Router>



    );
}
