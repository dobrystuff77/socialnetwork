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
            state.friendsWannabes.filter(friend => !friend.accepted)
    );

    console.log("friendsWannabes: ", friendsWannabes);
    console.log("acceptedFriends: ", acceptedFriends);

    useEffect(() => {
        console.log("ASDASD");
        dispatch(getStatus());
    }, []);

    return (
        <>
            <div className="usersmaincontainer">
                <div className="friendscontainer">
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
                                                key={index}
                                                className="friendsmallbox"
                                            >
                                                {user.picture_url && (
                                                    <>
                                                        <img
                                                            src={
                                                                user.picture_url
                                                            }
                                                            className="userpicturetwo"
                                                        />
                                                    </>
                                                )}
                                                {!user.picture_url && (
                                                    <>
                                                        <img
                                                            src="./default.jpg"
                                                            className="userpicturetwo"
                                                        />
                                                    </>
                                                )}
                                                <div className="usersfirstlast">
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
                                                    End Relationship
                                                </button>
                                            </div>
                                        </>
                                    );
                                })}
                        </div>
                    </div>
                    <div className="friends">
                        <div className="uploadmore">
                            <div className="picturesoptions">Wonnabes</div>
                        </div>
                        <div className="infriends">
                            {friendsWannabes &&
                                friendsWannabes.map((user, index) => {
                                    return (
                                        <>
                                            <div
                                                key={index}
                                                className="friendsmallbox"
                                            >
                                                {user.picture_url && (
                                                    <>
                                                        <img
                                                            src={
                                                                user.picture_url
                                                            }
                                                            className="userpicturetwo"
                                                        />
                                                    </>
                                                )}
                                                {!user.picture_url && (
                                                    <>
                                                        <img
                                                            src="./default.jpg"
                                                            className="userpicturetwo"
                                                        />
                                                    </>
                                                )}
                                                <div className="usersfirstlast">
                                                    {user.first} {user.last}
                                                </div>
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
                                                    Accept Invitation
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
// {
//     state.map((user, index) => {
//         return (
//             <>
//                 <div
//                     key={index}
//                     className="usersmallbox"
//                     onClick={() => showProfile(user.id)}
//                 >
//                     {user.picture_url && (
//                         <>
//                             <img
//                                 src={user.picture_url}
//                                 className="userpicture"
//                             />
//                         </>
//                     )}
//                     {!user.picture_url && (
//                         <>
//                             <img src="./default.gif" className="userpicture" />
//                         </>
//                     )}
//                     <div className="usersfirstlast">
//                         {user.first}
//                         {user.last}
//                     </div>
//                 </div>
//             </>
//         );
//     });
// }
