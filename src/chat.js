import React, { useEffect, useRef } from "react";
import { socket } from "./socket.js";
import { useSelector } from "react-redux";
import axios from "./axios";

export function Chat({ myId }) {
    const chatMessages = useSelector(state => state && state.chatMessages);
    const usersOnline = useSelector(state => state && state.online);

    // console.log("usersOnline in chat.js: ", usersOnline);
    // console.log("chatMessages: ", chatMessages);

    const elemRef = useRef();

    useEffect(() => {
        // console.log("Chat working");
        let { clientHeight, scrollTop, scrollHeight } = elemRef.current;
        elemRef.current.scrollTop = scrollHeight - clientHeight;
    }, [chatMessages]);

    useEffect(() => {
        // console.log("!!!!!!!!", usersOnline && usersOnline.lenght);
    }, [usersOnline]);

    const keyCheck = e => {
        if (e.key === "Enter") {
            e.preventDefault();
            socket.emit("newmessage", e.target.value);
            e.target.value = "";
        }
    };
    const showProfile = a => {
        // console.log("target: ", a);
        location.replace("/user/" + a);
    };

    // console.log("my id!!! ", myId);
    return (
        <div className="chat-container">
            <div className="wrapper">
                <div className="flexfullcolumn">
                    <div className="online-header">Users Online</div>
                </div>
                <div className="onlineusers-container">
                    {usersOnline &&
                        usersOnline.map((online, index) => {
                            return (
                                <div className="onlineuser" key={index}>
                                    <div
                                        className="onlinepicturewrapper"
                                        onClick={() => showProfile(online.id)}
                                    >
                                        <div className="online-dot"></div>
                                        {online.picture_url && (
                                            <img
                                                src={online.picture_url}
                                                className="onlinepicture"
                                            />
                                        )}
                                        {!online.picture_url && (
                                            <img
                                                src="./default.jpg"
                                                className="onlinepicture"
                                            />
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                </div>

                <div className="bigchatcontainer">
                    <div className="chat-wrapper" ref={elemRef}>
                        {chatMessages &&
                            chatMessages
                                .slice(0)
                                .reverse()
                                .map((message, index) => {
                                    return (
                                        <>
                                            {message.id === myId && (
                                                <div
                                                    className="messagecontainer"
                                                    key={index}
                                                >
                                                    <div
                                                        className="onlinepicturewrapper"
                                                        style={{
                                                            width: "60px"
                                                        }}
                                                    >
                                                        {message.picture_url && (
                                                            <img
                                                                src={
                                                                    message.picture_url
                                                                }
                                                                className="onlinepicture"
                                                            />
                                                        )}
                                                        {!message.picture_url && (
                                                            <img
                                                                src="./default.jpg"
                                                                className="onlinepicture"
                                                            />
                                                        )}
                                                    </div>
                                                    <div className="textchatwrapper">
                                                        <div className="firstlastinchat">
                                                            <div className="firstlast">
                                                                {message.first}
                                                                &nbsp;
                                                                {message.last}
                                                            </div>
                                                        </div>
                                                        <div className="textcontainerinchat">
                                                            <div className="textinchat">
                                                                <div className="date">
                                                                    {new Date(
                                                                        message.created_at
                                                                    ).toLocaleDateString(
                                                                        "en-US",
                                                                        {
                                                                            hour:
                                                                                "2-digit",
                                                                            minute:
                                                                                "2-digit"
                                                                        }
                                                                    )}
                                                                </div>

                                                                {
                                                                    message.message
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    );
                                })}
                    </div>
                    <textarea
                        placeholder="Add your message here"
                        onKeyDown={keyCheck}
                    ></textarea>
                    <div className="flexfullcolumn">
                        <div className="edit">Chat</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
