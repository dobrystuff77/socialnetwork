import React from "react";
import axios from "../../../axios"; // ./ oznacza ze importuje kopie axiosa czesto sie o tym zapomina
import { Link } from "react-router-dom";

export default class Registration extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    handleChange(e) {
        // to samo inaczej this[e.target.name] = e.target.value;
        // console.log("e.target.name: ", e.target.name);
        // console.log("e.target.value: ", e.target.value);
        this.setState({
            [e.target.name]: e.target.value
        });

        // console.log("this.state: ", this.state);
    } ///
    submit() {
        //inaczej axios.post("/register", this.state);
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
                console.log("data in axios post: ", data);
                console.log("data.data.success: ", data.data.success);
                if (data.data.success) {
                    //it worked
                    console.log("added user succes: true");
                    location.replace("/");
                } else {
                    // failure!
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
                <div className="register-button">
                    <Link to="/login">log in!</Link>
                </div>
            </div>
        );
    }
}
