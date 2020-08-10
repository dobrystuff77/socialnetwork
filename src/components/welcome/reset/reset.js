import React from "react";
import axios from "../../../axios"; // ./ oznacza ze importuje kopie axiosa czesto sie o tym zapomina
import { Link } from "react-router-dom";

export default class Reset extends React.Component {
    constructor(props) {
        super(props);
        this.state = { error: false };
    }
    handleChange(e) {
        // to samo inaczej this[e.target.name] = e.target.value;
        // console.log("e.target.name: ", e.target.name);
        // console.log("e.target.value: ", e.target.value);
        this.setState({
            [e.target.name]: e.target.value
        });

        console.log("this.state: ", this.state);
    } ///
    submit() {
        this.setState({
            error: false
        });

        //inaczej axios.post("/register", this.state);
        console.log("this.state.step: ", this.state.step);
        console.log(this.state.email);
        axios
            .post("/reset/start", {
                email: this.state.email
            })
            .then(data => {
                console.log("*****************AXIOS POST/reset");
                console.log("data in axios post: ", data);
                console.log("data.data.success: ", data.data.success);
                if (data.data.success) {
                    this.setState({
                        step: 2
                    });

                    console.log("login user succes: true");
                    // location.replace("/");
                } else {
                    // failure!
                    console.log("login user succes: false");
                    this.setState({
                        error: true,
                        step: undefined
                    });
                }
            });
    }

    changePass() {
        // console.log("changePass: ");
        // console.log("this.state.code:", this.state.code);
        // console.log("this.state.newpass:", this.state.newpass);
        axios
            .post("/reset/verify", {
                state: this.state
            })
            .then(data => {
                console.log("*****************AXIOS POST/reset/verify");
                console.log("data in axios post: ", data);
                console.log("data.data.success: ", data.data.success);
                if (data.data.success) {
                    this.setState({
                        step: 3,
                        error: false
                    });
                    console.log("change password succes: true");
                } else {
                    console.log("no password update");
                    this.setState({
                        error: true
                    });
                }
            })
            .catch(err => {
                console.log("err in AXIOS POST/reset/verify:", err);
            });
    }

    render() {
        return (
            <div className="container">
                {this.state.error && <div className="error">OOps!</div>}
                {this.state.step == undefined && (
                    <div className="inputs">
                        <div className="resettext">RESET PASSWORD STEP I</div>

                        <input
                            name="email"
                            onChange={e => this.handleChange(e)}
                            placeholder="email"
                        />

                        <button
                            className="register-button"
                            onClick={() => this.submit()}
                        >
                            submit
                        </button>
                    </div>
                )}
                {this.state.step == 2 && (
                    <div className="container">
                        <div className="resettext">RESET PASSWORD STEP II</div>
                        <input
                            name="code"
                            onChange={e => this.handleChange(e)}
                            placeholder="code"
                        />
                        <input
                            name="newpass"
                            onChange={e => this.handleChange(e)}
                            placeholder="newpass"
                            type="password"
                        />
                        <button
                            className="register-button"
                            onClick={() => this.changePass()}
                        >
                            Change Password
                        </button>
                    </div>
                )}
                {this.state.step == 3 && (
                    <div className="link">
                        <div className="resettext">
                            Successful Password Reset!
                        </div>
                        <div className="register-button">
                            <Link to="/login">Click here to log in!</Link>
                        </div>
                    </div>
                )}
            </div>
        );
    }
}
