import { useState } from "react";
import axios from "../src/axios";

export function useAuthSubmit(url, values) {
    const [error, setError] = useState();
    const handleSubmit = e => {
        e.preventDefault();
        axios
            .post(url, values)
            .then(({ data }) => {
                console.log("response in axios in useAuthSubmit: ", data);
                console.log("data.success ", data.success);
                if (!data.success) {
                    setError(true);
                } else {
                    location.replace("/");
                }
            })
            .catch(err => {
                console.log(err);
                setError(true);
            });
    };
    return [error, handleSubmit];
}
