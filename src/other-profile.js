import React from "react";
import axios from "./axios";
import FriendButton from "./friendbutton";
import SmallPicturesUser from "./smallpicturesuser";

export class OtherProfile extends React.Component {
    constructor() {
        super();
        this.state = {};
    }

    componentDidMount() {
        //where we want to make a request to the server to get all the info about the requested user..
        // console.log("this.props.matchparams.id: ", this.props.match.params.id);
        // sprawdzam czy id requestu zgadza sie z id obecnie zalogowanego w froncie oczywiscie server wysyla wszystkie info ktorych potrzebuje
        //jezeli ids sa to same odsylam do /
        axios
            .get("/user/" + this.props.match.params.id + ".json")
            .then(
                ({ data }) => {
                    // console.log("axios /user/:id respond:", data);
                    if (this.props.match.params.id == data.userId) {
                        // console.log("data.userId:", data.userId);
                        // console.log(
                        //     "this.props.match.params.id:",
                        //     this.props.match.params.id
                        // );
                        this.props.history.push("/");
                    } else {
                        this.setState(data);
                    }
                } //wsadzam odp do state
            )
            .catch("err in axios GET/user/:id");
        // demo!!!

        //we want to redirect if the user doesn exist...
    }

    render() {
        return (
            <div className="profile">
                {this.state.userId && (
                    <div className="underheader">
                        <div className="picfirstlast">
                            {this.state.picture_url && (
                                <div className="flexpicprofile">
                                    <img
                                        src={this.state.picture_url}
                                        className="profilepicbig"
                                    />
                                </div>
                            )}
                            {!this.state.picture_url && (
                                <div className="flexpicprofile">
                                    <img
                                        src="/default.jpg"
                                        className="profilepicbig"
                                    />
                                </div>
                            )}

                            <div className="firstlastunderheader">
                                {this.state.first} {this.state.last}
                            </div>
                            <div className="bio">
                                <div className="biocontainer">
                                    <div className="flexfullcolumn">
                                        <div className="biotextcontainer">
                                            <div className="mybio">
                                                <img
                                                    src="/biography.svg"
                                                    className="biography"
                                                />
                                                Bio
                                            </div>

                                            <div className="biotext">
                                                {this.state.bio}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <FriendButton
                                sender_id={this.state.userId}
                                recipient_id={this.props.match.params.id}
                            />
                        </div>
                        {/*<SmallPicturesUser id={this.props.match.params.id} />*/}
                    </div>
                )}

                {!this.state.userId && (
                    <div className="doesntexist">USER DOESNT EXIST</div>
                )}
            </div>
        );
    }
}
