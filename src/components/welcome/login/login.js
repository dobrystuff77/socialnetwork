import React from "react";
import { Link } from "react-router-dom";

import { useStatefulFields } from "../../../../hooks/useStatefulFields";
import { useAuthSubmit } from "../../../../hooks/useAuthSubmit";

export default function Login() {
    const [values, handleChange] = useStatefulFields();
    const [error, handleSubmit] = useAuthSubmit("/login", values);

    console.log("values:", values);

    return (
        <div className="container">
            {error && <p>OOps!</p>}
            <input
                type="email"
                name="email"
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
            <div className="loginlink">
                <Link to="/reset">reset password</Link>
            </div>
        </div>
    );
}
