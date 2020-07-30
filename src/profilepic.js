import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

// export default class Profile extends React.Component

export default class ProfilePic extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        // console.log("bio!!!!!: ", props.bio);
        // console.log("props in profilePic: ", props);
        // console.log("props.first: ", props.first);
        // console.log("props.first: ", props.last);
    }
    backToProfile() {
        location.replace("/");
    }

    render() {
        return (
            <div className="flexpic">
                <div className="flex">
                    {this.props.picture_url && (
                        <>
                            <img
                                src={this.props.picture_url}
                                onClick={this.props.clickHandler}
                                className="profilepic"
                            />
                        </>
                    )}
                    {!this.props.picture_url && (
                        <>
                            <img
                                src="./default.jpg"
                                onClick={this.props.clickHandler}
                                className="profilepic"
                            />
                        </>
                    )}
                </div>
                <div className="picheader" onClick={() => this.backToProfile()}>
                    <a href="#" className="ahref">
                        {this.props.first}
                        &nbsp;
                        {this.props.last}
                    </a>
                </div>
            </div>
        );
    }
}
