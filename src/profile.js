import React from "react";
import axios from "./axios"; // ./ oznacza ze importuje kopie axiosa czesto sie o tym zapomina
import { Link } from "react-router-dom";
import BioEditor from "./bioeditor";
import SmallPictures from "./smallpictures";
import Friends from "./friends";
import { Chat } from "./chat.js";
import SmallFriends from "./smallfriends";

export default class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        // console.log("bio!!!!!: ", props.bio);
    }

    render() {
        return (
            <React.Fragment>
                <div className="picfirstlast">
                    <div className="flexpicprofile">
                        <img
                            src={this.props.picture_url}
                            onClick={this.props.invisibleUploader}
                            className="profilepicbig"
                        />
                    </div>
                    <div className="firstlastunderheader">
                        {this.props.first} {this.props.last}
                    </div>
                    <div className="bio">
                        <BioEditor
                            picture_url={this.props.picture_url}
                            first={this.props.first}
                            last={this.props.last}
                            bio={this.props.bio}
                            editBio={this.props.editBio}
                            clickHandler={() =>
                                this.setState({ uploaderIsVisible: true })
                            }
                        />
                    </div>
                </div>
                <SmallPictures />
                <Chat />
                <SmallFriends />
            </React.Fragment>
        );
    }
}

// <img src="logo.gif " className="biglogo" />;
