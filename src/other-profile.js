import React from "react";
import axios from "./axios";
import FriendButton from "./friendbutton";

export class OtherProfile extends React.Component {
    constructor() {
        super();
        this.state = {};
    }

    componentDidMount() {
        axios
            .get("/user/" + this.props.match.params.id + ".json")
            .then(({ data }) => {
                if (this.props.match.params.id == data.userId) {
                    this.props.history.push("/");
                } else {
                    this.setState(data);
                }
            })
            .catch("err in axios GET/user/:id");
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
                    </div>
                )}

                {!this.state.userId && (
                    <div className="doesntexist">USER DOESNT EXIST</div>
                )}
            </div>
        );
    }
}
