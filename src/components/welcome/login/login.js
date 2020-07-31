import React from "react";
// import axios from "../../../axios"; // ./ oznacza ze importuje kopie axiosa czesto sie o tym zapomina
import { Link } from "react-router-dom";

import { useStatefulFields } from "../../../../hooks/useStatefulFields";
import { useAuthSubmit } from "../../../../hooks/useAuthSubmit";

// import classes from "./login.modules.css";

export default function Login() {
    const [values, handleChange] = useStatefulFields();
    const [error, handleSubmit] = useAuthSubmit("/login", values);

    console.log("values:", values);

    return (
        <div className="container">
            {error && <p>OOps!</p>}
            <input
                name="email"
                type="text"
                onChange={handleChange}
                placeholder="email"
            />
            <input
                name="password"
                type="password"
                onChange={handleChange}
                placeholder="password"
            />
            <button className="register-button" onClick={handleSubmit}>
                submit
            </button>
            <div className="register-button">
                <Link to="/reset">reset password</Link>
            </div>
        </div>
    );
}

// return (
//     <div className="container">
//         {this.state.error && <div className="error">OOps!</div>}
//         <input
//             name="email"
//             onChange={e => this.handleChange(e)}
//             placeholder="email"
//         />
//         <input
//             name="password"
//             onChange={e => this.handleChange(e)}
//             placeholder="password"
//             type="password"
//         />
//         <button onClick={e => this.submit()}>Log in</button>
//         <div className="links">
//             <Link to="/">Click here to Register!</Link>
//             <br></br>
//             <Link to="/reset">Reset password</Link>
//         </div>
//     </div>
// );

// export default class Login extends React.Component {
//     constructor(props) {
//         super(props);
//         this.state = {};
//     }
//     handleChange(e) {
//         // to samo inaczej this[e.target.name] = e.target.value;
//         // console.log("e.target.name: ", e.target.name);
//         // console.log("e.target.value: ", e.target.value);
//         this.setState({
//             [e.target.name]: e.target.value
//         });
//
//         // console.log("this.state: ", this.state);
//     } ///
//     submit() {
//         //inaczej axios.post("/register", this.state);
//         console.log(this.state.email, this.state.password);
//         axios
//             .post("/login", {
//                 email: this.state.email,
//                 password: this.state.password
//             })
//             .then(data => {
//                 console.log("*****************AXIOS POST/login");
//                 console.log("data in axios post: ", data);
//                 console.log("data.data.success: ", data.data.success);
//                 if (data.data.success) {
//                     //it worked
//                     console.log("login user succes: true");
//                     location.replace("/");
//                 } else {
//                     // failure!
//                     console.log("login user succes: false");
//                     this.setState({
//                         error: true
//                     });
//                 }
//             });
//     }
//     render() {
//         return (
//             <div className="container">
//                 {this.state.error && <div className="error">OOps!</div>}
//                 <input
//                     name="email"
//                     onChange={e => this.handleChange(e)}
//                     placeholder="email"
//                 />
//                 <input
//                     name="password"
//                     onChange={e => this.handleChange(e)}
//                     placeholder="password"
//                     type="password"
//                 />
//                 <button onClick={e => this.submit()}>Log in</button>
//                 <div className="links">
//                     <Link to="/">Click here to Register!</Link>
//                     <br></br>
//                     <Link to="/reset">Reset password</Link>
//                 </div>
//             </div>
//         );
//     }
// }

// <a href="/registration">Click here to Register!</a>
