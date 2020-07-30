import React from "react";
import axios from "./axios";

export default class SmallFriends extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pictures: []
        };
    }

    componentDidMount() {
        console.log(
            "**********************componentDidMount() in smallfriends"
        );
        console.log("this.props: ", this.props);
        axios
            .get("/allfriends.json")
            .then(
                ({ data }) => {
                    console.log(
                        "************AXIOS IN componentDidMount GET/allfrinds in smallfriends"
                    );
                    console.log("data.length:", data.length);

                    if (data.length == 0) {
                        this.setState({
                            nopictures: true
                        });
                    } else if (data.length > 0) {
                        // let newState = { ...this.state };
                        this.setState({
                            pictures: data.slice(0, 4)
                        });
                    }

                    // console.log("data.first:", data.first);
                    // console.log("data.last:", data.last);
                    // console.log("data.id:", data.bio);                    }
                    // console.log("data.id:", data.id);
                    // console.log("result in axios: ", data);
                } //wsadzam odp do state
            )
            .catch("err in axios GET/user in smallfriends");
    }

    render() {
        // console.log("this.state:", this.state.first);
        return (
            <React.Fragment>
                <div className="smallpicturescontainer">
                    {this.state.nopictures && (
                        <div className="nopictures">All Friends</div>
                    )}

                    {this.state.pictures.map((picture, index) => {
                        return (
                            <>
                                {picture.picture_url && (
                                    <img
                                        key={index}
                                        src={picture.picture_url}
                                        className="smallpicture"
                                    />
                                )}
                                {!picture.picture_url && (
                                    <img
                                        key={index}
                                        src="./default.jpg"
                                        className="smallpicture"
                                    />
                                )}
                            </>
                        );
                    })}
                    <div className="firstlastunderheader">Friends</div>

                    <div className="bio">
                        <div className="biocontainer">
                            <div className="flexfullcolumn">
                                <div className="addbio">
                                    <div>
                                        <img
                                            src="album.svg"
                                            className="biography"
                                        />
                                        <a
                                            href="#"
                                            className="edit"
                                            onClick={() =>
                                                location.replace("/friends")
                                            }
                                        >
                                            All Friends
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}
