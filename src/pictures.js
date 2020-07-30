import React from "react";
import axios from "./axios";
import NewUploader from "./newuploader";

export class Pictures extends React.Component {
    constructor() {
        super();
        this.state = {
            pictures: []
        };
    }

    componentDidMount() {
        console.log("**********************componentDidMount() in pictures");
        axios
            .get("/allpictures")
            .then(
                ({ data }) => {
                    console.log(
                        "************AXIOS IN componentDidMount GET/pictures in pictures"
                    );
                    console.log("data:", data);

                    this.setState({
                        pictures: data
                    });
                    // console.log("data.first:", data.first);
                    // console.log("data.last:", data.last);
                    // console.log("data.id:", data.bio);                    }
                    // console.log("data.id:", data.id);
                    // console.log("result in axios: ", data);
                } //wsadzam odp do state
            )
            .catch("err in axios GET/user in pictures");
    }

    render() {
        // console.log("this.state:", this.state.first);
        return (
            <React.Fragment>
                <div className="usersmaincontainer">
                    <div className="lastadded">PICTURES</div>
                    <div className="uploadmore">
                        <div
                            className="picturesoptions"
                            onClick={() => {
                                console.log("onClick");
                                this.setState({
                                    uploaderIsVisible: true
                                });
                            }}
                        >
                            Uplad More
                        </div>
                    </div>

                    <div className="userscontainer">
                        {this.state.pictures.map((picture, index) => (
                            <div className="pictureinpictures">
                                <img
                                    key={index}
                                    src={picture.picture}
                                    className="userpicture"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {this.state.uploaderIsVisible && (
                    <NewUploader
                        setImageUrl={picture_url =>
                            this.setState({ picture_url })
                        }
                        invisibleUploader={() =>
                            this.setState({
                                uploaderIsVisible: false
                            })
                        }
                        updatePictures={newpictures =>
                            this.setState({
                                pictures: newpictures
                            })
                        }
                    />
                )}

                {this.state.smallPictures && (
                    <>
                        <div className="picuressmallcontainer">
                            <div className="smallpicturesunderheader">
                                Pictures
                            </div>
                            <div className="smallpictures"></div>
                            <div className="uploadmorecontainer">
                                <div className="uploadmore">Upload</div>
                                <div className="uploadmore">More</div>
                            </div>
                        </div>
                    </>
                )}
            </React.Fragment>
        );
    }
}
