import React from "react";
import axios from "./axios"; // ./ oznacza ze importuje kopie axiosa czesto sie o tym zapomina

export default class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = { bio: props.bio };
    }
    clickHandler(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }
    submitBio(e) {
        this.editFalse(e);
        e.preventDefault();
        axios
            .post("/bio", {
                bio: this.state.bio
            })
            .then(result => {
                this.props.editBio(this.state.bio);
            })
            .catch(err => {
                console.log("err in post axios/bio: ", err);
            });
    }

    editTrue() {
        this.setState({
            edit: true
        });
    }
    editFalse() {
        this.setState({
            edit: false
        });
    }
    render() {
        return (
            <div className="biocontainer">
                {!this.state.edit && (
                    <div className="flexfullcolumn">
                        {this.props.bio && (
                            <div className="biotextcontainer">
                                <div className="mybio">
                                    <img
                                        src="biography.svg"
                                        className="biography"
                                    />
                                    Bio
                                </div>

                                <div className="biotext">{this.props.bio}</div>

                                <button
                                    onClick={e => this.editTrue(e)}
                                    className="friendbutton"
                                >
                                    edit
                                </button>
                            </div>
                        )}
                        {!this.props.bio && (
                            <div className="addbio">
                                <div onClick={e => this.editTrue(e)}>
                                    <img
                                        src="biography.svg"
                                        className="biography"
                                    />
                                    <a href="#d" className="edit">
                                        Add Bio
                                    </a>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {this.state.edit && (
                    <div className="editbiocontainer">
                        <div className="mybio">
                            <img src="biography.svg" className="biography" />
                            Bio
                        </div>

                        <form className="justflexcolumn">
                            <textarea
                                name="bio"
                                type="text"
                                className="bioinput"
                                onChange={e => this.clickHandler(e)}
                                value={this.state.bio}
                            />
                            <div className="justflex">
                                <button
                                    onClick={e => this.submitBio(e)}
                                    className="friendbutton"
                                >
                                    submit
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        );
    }
}
