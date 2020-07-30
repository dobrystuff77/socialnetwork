import React, { useState } from "react";

//musi byc use
export function useStatefulFields() {
    const [values, setValues] = useState({});
    const handleChange = e => {
        // console.log("in userStatefulFields: ", values);
        setValues({
            ...values,
            [e.target.name]: e.target.value
        });
        // console.log("after userStatefulFields: ", values);
    };

    return [values, handleChange];
}
