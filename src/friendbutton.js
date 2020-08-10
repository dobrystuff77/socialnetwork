import React, { useState, useEffect } from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

import { useStatefulFields } from "../hooks/useStatefulFields";
import { useAuthSubmit } from "../hooks/useAuthSubmit";

export default function FriendButton(props) {
    const [friendOrNot, setFriendOrNot] = useState([]);
    const [change, setChange] = useState("");

    useEffect(() => {
        (async () => {
            try {
                const { data } = await axios.get(
                    "/friends-status/" + props.recipient_id + ".json"
                );

                setFriendOrNot(data);
            } catch (e) {
                console.log(e);
            }
        })();
    }, [change]);

    const unfriendlyButton = () => {
        (async () => {
            try {
                if (friendOrNot.btnText == "Send Friend Request") {
                    const { data } = await axios.post(
                        "/make-friend-request/" + props.recipient_id + ".json"
                    );
                    setChange("a");
                } else if (
                    friendOrNot.btnText == "Cancel Friend Request" ||
                    friendOrNot.btnText == "Unfriend"
                ) {
                    const { data } = await axios.post(
                        "/cancel/" + props.recipient_id + ".json"
                    );
                    setChange("b");
                } else if (friendOrNot.btnText == "Accept Friend Request") {
                    const { data } = await axios.post(
                        "/update/" + props.recipient_id + ".json"
                    );
                    setChange("c");
                } else friendOrNot.btnText = "no button text";
            } catch (e) {
                console.log(e);
            }
        })();
    };

    return (
        <>
            <button className="friend-button" onClick={unfriendlyButton}>
                {friendOrNot.btnText}
            </button>
        </>
    );
}
