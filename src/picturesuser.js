import React from "react";
import axios from "./axios";

export default class PicturesUser extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pictures: []
        };
    }

    componentDidMount() {
        console.log(
            "**********************componentDidMount() in picturesuser"
        );
        console.log("this.props.match.params.id: ", this.props.match.params.id);
        axios
            .get("/allpicturesuser/" + this.props.match.params.id)
            .then(
                ({ data }) => {
                    console.log(
                        "************AXIOS IN componentDidMount GET/allpicturesuser in picturesuser"
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
