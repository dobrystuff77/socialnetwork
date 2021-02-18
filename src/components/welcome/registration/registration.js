import React from "react";
import axios from "../../../axios"; 
import { Link } from "react-router-dom";

export default class Registration extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    } 

    submit() {
        console.log(
            this.state.first,
            this.state.last,
            this.state.email,
            this.state.password
        );
        axios
            .post("/register", {
                first: this.state.first,
                last: this.state.last,
                email: this.state.email,
                password: this.state.password
            })
            .then(data => {
                if (data.data.success) {
                    location.replace("/");
                } else {
                    console.log("no added user succes: false");
                    this.setState({
                        error: true
                    });
                }
            });
    }

    render() {
        return (
            <div className="container">
                {this.state.error && <div className="error">OOps!</div>}
                <input
                    name="first"
                    onChange={e => this.handleChange(e)}
                    placeholder="first"
                />
                <input
                    name="last"
                    onChange={e => this.handleChange(e)}
                    placeholder="last"
                />
                <input
                    type="email"
                    name="email"
                    onChange={e => this.handleChange(e)}
                    placeholder="email"
                />
                <input
                    name="password"
                    onChange={e => this.handleChange(e)}
                    placeholder="password"
                    type="password"
                />
                <button
                    className="register-button"
                    onClick={() => this.submit()}
                >
                    register
                </button>
                <div className="loginlink">
                    <Link to="/login">log in!</Link>
                </div>
            </div>
        );
    }
}
