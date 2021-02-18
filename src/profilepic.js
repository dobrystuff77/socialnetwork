import React from "react";

export default class ProfilePic extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    backToProfile() {
        location.replace("/");
    }

    render() {
        return (
            <>
                <div className="flex">
                    {this.props.picture_url && (
                        <div className="profilepic-container">
                            <img
                                src={this.props.picture_url}
                                onClick={() => this.backToProfile()}
                                className="profilepic"
                            />
                        </div>
                    )}
                    {!this.props.picture_url && (
                        <>
                            <img
                                src="./default.jpg"
                                onClick={() => this.backToProfile()}
                                className="profilepic"
                            />
                        </>
                    )}
                </div>
                <div
                    className="nameheader display"
                    onClick={() => this.backToProfile()}
                >
                    <a href="#" className="ahref">
                        {this.props.first}
                    </a>
                </div>
            </>
        );
    }
}
