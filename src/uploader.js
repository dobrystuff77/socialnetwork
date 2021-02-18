import React from "react";
import axios from "./axios";

export default class Uploader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false
        };
    }
    takeFile(e) {
        console.log("takeFile e.target.file: ", e.target.files[0]);
        this.setState({
            [e.target.name]: e.target.files[0]
        });
    }
    closeX() {
        this.props.invisibleUploader();
        console.log("closeX");
    }
    clickHandler(e) {
        e.preventDefault();
        this.setState({
            loading: true
        });

        console.log("clickHandler!!!!");
        console.log("this.state:", this.state.file);

        var formData = new FormData();
        formData.append("file", this.state.file);

        axios
            .post("/upload", formData)
            .then(result => {
                this.props.setImageUrl(result.data.picture_url);
                this.setState({
                    loading: false
                });
                this.closeX(e);
            })
            .catch(err => {
                console.log("err in post axios: ", err);
            });
    }

    render() {
        return (
            <div className="uploader">
                <div className="x">
                    <div onClick={e => this.closeX(e)} className="xclose">
                        <div className="close"></div>
                    </div>
                </div>

                <div className="uploader-container">
                    {this.state.loading && (
                        <div className="loading">
                            <img src="./loading.gif" />
                        </div>
                    )}

                    {!this.state.loading && (
                        <>
                            <div className="upload-text">
                                Upload Profile Picture
                            </div>
                            <div className="upload-btn-wrapper">
                                <button className="btn">
                                    choose profile picture
                                </button>
                                <input
                                    name="file"
                                    type="file"
                                    accept="image/*"
                                    className="choosepic"
                                    onChange={e => this.takeFile(e)}
                                />
                            </div>
                            <button
                                onClick={e => this.clickHandler(e)}
                                className="btn"
                            >
                                submit
                            </button>
                        </>
                    )}
                </div>
            </div>
        );
    }
}


