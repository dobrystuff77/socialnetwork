import React from "react";
import BioEditor from "./bioeditor";

export default class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
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
            </React.Fragment>
        );
    }
}
