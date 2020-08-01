import React from "react";
import axios from "./axios";
import ProfilePic from "./profilepic";
import Uploader from "./uploader";
import Profile from "./profile";
import { Pictures } from "./pictures";
import PicturesUser from "./picturesuser";

import { BrowserRouter, Route } from "react-router-dom";
import { OtherProfile } from "./other-profile";

import { Chat } from "./chat";

import Users from "./users";
import Friends from "./friends";

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    // mounted jak z vue
    componentDidMount() {
        // console.log("**********************componentDidMount()");
        axios
            .get("/user")
            .then(
                ({ data }) => {
                    // console.log(
                    //     "************AXIOS IN componentDidMount GET/user"
                    // );
                    // console.log("data:", data);
                    // console.log("data.first:", data.first);
                    // console.log("data.last:", data.last);
                    // console.log("data.id:", data.bio);
                    if (data.picture_url == null) {
                        data.picture_url = "/default.jpg";
                        // console.log(
                        //     "data.picture_url in if: ",
                        //     data.picture_url
                        // );
                        this.setState(data);
                    } else {
                        this.setState(data);
                    }
                    // console.log("data.id:", data.id);
                    // console.log("result in axios: ", data);
                } //wsadzam odp do state
            )
            .catch("err in axios GET/user");
    }
    logOut() {
        // console.log("logout method");
        axios
            .get("/logout")
            .then(() => {
                // console.log("AXIOS GET/logout");
                location.replace("/");
            })
            .catch(err => {
                console.log("err in axios logout method: ", err);
            });
    }

    allUsers() {
        // console.log("allUsers method");
        location.replace("/users");
    }
    render() {
        if (!this.state.id) {
            return (
                <div
                    style={{
                        width: "100%",
                        height: "100vh",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center"
                    }}
                >
                    <div className="loading-big">
                        <img src="/loading.gif" alt="Loading..." />
                    </div>
                </div>
            );
        }
        return (
            <BrowserRouter>
                <React.Fragment>
                    <div className="header">
                        <div className="inheaderl">
                            <img
                                src="/network.svg"
                                className="smalltreelogo"
                                href="#"
                                onClick={() => location.replace("/")}
                            />
                        </div>
                        <div className="header-icons-container">
                            <div
                                className="header-icon"
                                onClick={() => location.replace("/friends")}
                            >
                                <img src="/friends.svg" />
                            </div>
                            <div
                                className={"header-icon"}
                                onClick={() => location.replace("/users")}
                            >
                                <img src="/search.svg" />
                            </div>
                            <div
                                className="header-icon"
                                onClick={() => location.replace("/chat")}
                            >
                                <img src="/chat.svg" />
                            </div>
                            <div
                                className="header-icon"
                                onClick={e => this.logOut(e)}
                            >
                                <img src="/logout.svg" />
                            </div>
                            <ProfilePic
                                clickHandler={() =>
                                    this.setState({
                                        uploaderIsVisible: true
                                    })
                                }
                                picture_url={this.state.picture_url}
                                first={this.state.first}
                                last={this.state.last}
                            />
                        </div>

                        {/*
                            <div
                                className="logout"
                                onClick={e => this.allUsers(e)}
                            >
                                <a href="#" className="ahref">
                                    Users
                                </a>
                            </div>

                            <div className="pureflex">
                                <div className="arrcontainer">
                                    <img
                                        src="/arrdown.svg"
                                        className="arrdown"
                                    />
                                </div>
                                <div className="dropdown-menu">
                                    <a href="#" onClick={e => this.logOut(e)}>
                                        Logout
                                    </a>
                                    <a href="#">Shop</a>
                                    <a href="#">Charity</a>
                                    <a href="#">Edit profile</a>
                                    <a
                                        href="#"
                                        onClick={() =>
                                            location.replace("/pictures")
                                        }
                                    >
                                        Pictures
                                    </a>
                                </div>
                            </div>*/}
                        {/*</div>*/}
                        {this.state.uploaderIsVisible && (
                            <Uploader
                                setImageUrl={picture_url =>
                                    this.setState({ picture_url })
                                }
                                invisibleUploader={() =>
                                    this.setState({
                                        uploaderIsVisible: false
                                    })
                                }
                            />
                        )}
                    </div>
                    {/*
                    <div className="header">
                        <div className="inheaderl">
                            <div className="flex">
                                <img
                                    src="/tree.svg"
                                    className="smalltreelogo"
                                />
                            </div>
                            <div className="smallwetreenow">somenetwork</div>
                        </div>
                        <div className="inheaderp">
                            <ProfilePic
                                clickHandler={() =>
                                    this.setState({
                                        uploaderIsVisible: true
                                    })
                                }
                                picture_url={this.state.picture_url}
                                first={this.state.first}
                                last={this.state.last}
                            />

                            <div
                                className="logout"
                                onClick={e => this.allUsers(e)}
                            >
                                <a href="#" className="ahref">
                                    Users
                                </a>
                            </div>

                            <div className="pureflex">
                                <div className="arrcontainer">
                                    <img
                                        src="/arrdown.svg"
                                        className="arrdown"
                                    />
                                </div>
                                <div className="dropdown-menu">
                                    <a href="#" onClick={e => this.logOut(e)}>
                                        Logout
                                    </a>
                                    <a href="#">Shop</a>
                                    <a href="#">Charity</a>
                                    <a href="#">Edit profile</a>

                                </div>
                            </div>
                        </div>
                        {this.state.uploaderIsVisible && (
                            <Uploader
                                setImageUrl={picture_url =>
                                    this.setState({ picture_url })
                                }
                                invisibleUploader={() =>
                                    this.setState({
                                        uploaderIsVisible: false
                                    })
                                }
                            />
                        )}
                    </div>
*/}

                    <Route path="/users" component={Users} />
                    {/*<Route path="/pictures" component={Pictures} />*/}
                    <Route path="/user/:id" component={OtherProfile} />
                    <Route path="/friends" component={Friends} />
                    {/*<Route path="/picturesuser/:id" component={PicturesUser} />*/}
                    <Route path="/chat" component={Chat} />
                    <div className="profile">
                        <div className="underheader">
                            <Route
                                exact
                                path="/"
                                render={() => (
                                    <Profile
                                        picture_url={this.state.picture_url}
                                        first={this.state.first}
                                        last={this.state.last}
                                        bio={this.state.bio}
                                        editBio={bio =>
                                            this.setState({ bio: bio })
                                        }
                                        addBio={() =>
                                            this.setState({
                                                profileInvisible: true
                                            })
                                        }
                                        invisibleUploader={() =>
                                            this.setState({
                                                uploaderIsVisible: true
                                            })
                                        }
                                    />
                                )}
                            />
                        </div>
                    </div>
                </React.Fragment>
            </BrowserRouter>
        );
    }
}

// <a
//     href="#"
//     onClick={() =>
//         location.replace("/pictures")
//     }
// >
//     Pictures
// </a>
