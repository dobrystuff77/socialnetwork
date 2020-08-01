import React, { useState, useEffect } from "react";
import axios from "./axios"; // ./ oznacza ze importuje kopie axiosa czesto sie o tym zapomina
import { Link } from "react-router-dom";

import { useStatefulFields } from "../hooks/useStatefulFields";
import { useAuthSubmit } from "../hooks/useAuthSubmit";

export default function FriendButton(props) {
    // console.log("myId in FriendButton: ", props.sender_id);
    // console.log("friendId in FriendButton: ", props.recipient_id);
    // console.log("friend button loaded!!!");
    const [friendOrNot, setFriendOrNot] = useState([]);
    const [change, setChange] = useState("");

    useEffect(() => {
        (async () => {
            try {
                console.log("before axios in useEffect");
                const { data } = await axios.get(
                    "/friends-status/" + props.recipient_id + ".json"
                );
                console.log("data in axios useEffect friendbutton:", data);
                setFriendOrNot(data);
            } catch (e) {
                console.log(e);
            }
        })();
    }, [change]);
    // console.log("friendonnor", friendOrNot);

    const unfriendlyButton = () => {
        console.log("addFriend: ");
        (async () => {
            try {
                if (friendOrNot.btnText == "Send Friend Request") {
                    console.log("Send Friend Request");
                    const { data } = await axios.post(
                        "/make-friend-request/" + props.recipient_id + ".json"
                    );
                    console.log("data in axios Send Friend Request:", data);
                    setChange("a");
                } else if (
                    friendOrNot.btnText == "Cancel Friend Request" ||
                    friendOrNot.btnText == "Unfriend"
                ) {
                    console.log("Cancel Friend Request");
                    const { data } = await axios.post(
                        "/cancel/" + props.recipient_id + ".json"
                    );
                    console.log("data in axios cancelInvitation:", data);
                    setChange("b");
                } else if (friendOrNot.btnText == "Accept Friend Request") {
                    console.log("Accept Friend Request");
                    const { data } = await axios.post(
                        "/update/" + props.recipient_id + ".json"
                    );
                    setChange("c");
                }
            } catch (e) {
                console.log(e);
            }
        })();
    };

    // const endFriendship = () => {
    //     console.log("endFriendship");
    //     // setUser(target.value);
    // };

    // const cancelInvitation = () => {
    //     console.log("cancelInvitation");
    //     (async () => {
    //         try {
    //             const { data } = await axios.post(
    //                 "/cancel/" + props.recipient_id + ".json"
    //             );
    //             console.log("data in axios cancelInvitation:", data);
    //             // setFriendOrNot(data);
    //             // setChangeButton(true);
    //         } catch (e) {
    //             console.log(e);
    //         }
    //     })();
    // };
    console.log("friendOrNot.btnText: ", friendOrNot.btnText);
    return (
        <>
            <button
                className="register-button"
                style={{ marginTop: "10px" }}
                onClick={unfriendlyButton}
            >
                {friendOrNot.btnText}
            </button>
        </>
    );
}

//
// <form>
//     {error && <p>something broke - not clutch </p>}
//     <input name="email" type="text" onChange={handleChange} />
//     <input name="password" type="password" onChange={handleChange} />
//     <button onClick={handleSubmit}>submit</button>
// </form>
