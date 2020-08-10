import React from "react";
import { HashRouter, Route } from "react-router-dom";
import Login from "./login/login";
import Registration from "./registration/registration";
import Reset from "./reset/reset";

export default class Welcome extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <HashRouter>
                <div className="register-container">
                    <div className="treelogocontainer">
                        <img
                            src="network.svg"
                            className="treelogo"
                            onClick={() => location.replace("/")}
                        />
                    </div>
                    <div className="simplenetwork">simplenetwork77</div>
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
