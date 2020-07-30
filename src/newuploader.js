import React from "react";
import axios from "./axios";

export default class NewUploader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    takeFile(e) {
        console.log("takeFile e.target.file: ", e.target.files[0]);
        this.setState({
            [e.target.name]: e.target.files[0]
        });
    }
    closeX(e) {
        this.props.invisibleUploader();
        console.log("closeX");
    }
    clickHandler(e) {
        e.preventDefault();
        console.log("clickHandler!!!!");
        console.log("this.state:", this.state.file);

        var formData = new FormData();
        formData.append("file", this.state.file);

        axios
            .post("/pictures", formData)
            .then(({ data }) => {
                console.log("result from axios /pictures: ", data);
                // this.propos.updatePictures(data);
                console.log(
                    "this.propos.updatePictures(data):",
                    this.props.updatePictures(data)
                );
            })
            .catch(err => {
                console.log("err in post axios pictures: ", err);
            });

        // axios.post("/register", {}).then(data => {});
    }

    render() {
        return (
            <div className="uploader">
                <div className="containeruploader">
                    <div className="flex">
                        <form>
                            <input
                                name="file"
                                type="file"
                                accept="image/*"
                                className="choosepic"
                                onChange={e => this.takeFile(e)}
                            />
                            <button onClick={e => this.clickHandler(e)}>
                                submit
                            </button>
                        </form>
                    </div>
                </div>
                <div className="x">
                    <div onClick={e => this.closeX(e)} className="xclose">
                        <div className="close"></div>
                    </div>
                </div>
            </div>
        );
    }
}

//                console.log("formData: ", formData); // to jest pusty obj nic szegolnego
