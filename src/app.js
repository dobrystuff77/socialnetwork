import React from "react";
import axios from "./axios";

import ProfilePic from "./profilepic";
import Uploader from "./uploader";
import Profile from "./profile";
import Users from "./users";
import Friends from "./friends";
import { Chat } from "./chat";

import { BrowserRouter, Route } from "react-router-dom";
import { OtherProfile } from "./other-profile";

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        axios
            .get("/user")
            .then(({ data }) => {
                if (data.picture_url == null) {
                    data.picture_url = "/default.jpg";
                    this.setState(data);
                } else {
                    this.setState(data);
                }
            })
            .catch("err in axios GET/user");
    }
    logOut() {
        axios
            .get("/logout")
            .then(() => {
                location.replace("/");
            })
            .catch(err => {
                console.log("err in axios logout method: ", err);
            });
    }

    allUsers() {
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
                    <img src="/loading.gif" alt="Loading..." />
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

                    <Route path="/users" component={Users} />
                    <Route path="/user/:id" component={OtherProfile} />
                    <Route path="/friends" component={Friends} />

                    <Route
                        exact
                        path="/chat"
                        render={() => <Chat myId={this.state.id} />}
                    />

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
