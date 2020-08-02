import React, { useState, useEffect } from "react";
import axios from "./axios";
import { useDispatch, useSelector } from "react-redux";
import { getStatus, unfriend, acceptFriend } from "./actions";

export default function Friends() {
    const dispatch = useDispatch();

    const acceptedFriends = useSelector(
        state =>
            state.friendsWannabes &&
            state.friendsWannabes.filter(friend => friend.accepted)
    );

    const friendsWannabes = useSelector(
        state =>
            state.friendsWannabes &&
            state.friendsWannabes.filter(friend => !friend.accepted).slice(0, 6)
    );

    console.log("acceptedFriends: ", acceptedFriends);
    console.log("friendsWannabes: ", friendsWannabes);

    useEffect(() => {
        dispatch(getStatus());
    }, []);

    const showProfile = a => {
        console.log("target: ", a);
        location.replace("/user/" + a);
    };

    return (
        <>
            <div className="usersmaincontainer">
                <div className="friendscontainer">
                    <div className="friends">
                        {friendsWannabes && (
                            <div className="uploadmore">
                                <div className="picturesoptions">Wannabes</div>
                            </div>
                        )}
                        <div className="infriends">
                            {friendsWannabes &&
                                friendsWannabes.map((user, index) => {
                                    return (
                                        <>
                                            <div
                                                key={user.id}
                                                className="friendsmallbox"
                                            >
                                                {user.picture_url && (
                                                    <div className="userpicturetwo-container">
                                                        <img
                                                            src={
                                                                user.picture_url
                                                            }
                                                            className="userpicturetwo"
                                                        />
                                                    </div>
                                                )}
                                                {!user.picture_url && (
                                                    <>
                                                        <div className="userpicturetwo-container">
                                                            <img
                                                                src="./default.jpg"
                                                                className="userpicturetwo"
                                                            />
                                                        </div>
                                                    </>
                                                )}
                                                <div className="friendsfirstlast">
                                                    {user.first} {user.last}
                                                </div>
                                                <div className="button-container">
                                                    <button
                                                        className="friendbutton"
                                                        onClick={e =>
                                                            dispatch(
                                                                acceptFriend(
                                                                    user.id
                                                                )
                                                            )
                                                        }
                                                    >
                                                        Confirm
                                                    </button>
                                                    <button
                                                        className="friendbutton"
                                                        onClick={e =>
                                                            dispatch(
                                                                unfriend(
                                                                    user.id
                                                                )
                                                            )
                                                        }
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        </>
                                    );
                                })}
                        </div>
                    </div>
                    <div className="friends">
                        <div className="uploadmore">
                            <div className="picturesoptions">Friends</div>
                        </div>
                        <div className="infriends">
                            {acceptedFriends &&
                                acceptedFriends.map((user, index) => {
                                    return (
                                        <>
                                            <div
                                                key={user.id}
                                                className="friendsmallbox"
                                            >
                                                {user.picture_url && (
                                                    <>
                                                        <div className="userpicturetwo-container">
                                                            <img
                                                                src={
                                                                    user.picture_url
                                                                }
                                                                className="userpicturetwo"
                                                            />
                                                        </div>
                                                    </>
                                                )}
                                                {!user.picture_url && (
                                                    <>
                                                        <div className="userpicturetwo-container">
                                                            <img
                                                                src="./default.jpg"
                                                                className="userpicturetwo"
                                                            />
                                                        </div>
                                                    </>
                                                )}
                                                <div className="friendsfirstlast">
                                                    {user.first} {user.last}
                                                </div>
                                                <button
                                                    className="friendbutton"
                                                    onClick={e =>
                                                        dispatch(
                                                            unfriend(user.id)
                                                        )
                                                    }
                                                >
                                                    Unfriend
                                                </button>
                                            </div>
                                        </>
                                    );
                                })}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
