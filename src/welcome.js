import React from "react";
import { HashRouter, Route } from "react-router-dom";
import Login from "./login";
import Registration from "./registration";
import Reset from "./reset";
// http://localhost:8080/#/
// http://localhost:8080/#/login
//exact zapobiega akceptowaniu wariacji url np /login/funkychicken

export default class Welcome extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <HashRouter>
                <div className="main">
                    <div className="treelogocontainer">
                        <img src="tree.svg" className="treelogo" />
                    </div>
                    <div className="wetreenow">somenetwork</div>
                    <div className="inputs">
                        <Route exact path="/" component={Registration} />
                        <Route exact path="/login" component={Login} />
                        <Route exact path="/reset" component={Reset} />
                    </div>
                </div>
            </HashRouter>
        );
    }
}

// <img src="logo.gif " className="biglogo" />;
