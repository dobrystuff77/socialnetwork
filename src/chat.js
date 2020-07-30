import React, { useEffect, useRef } from "react";
import { socket } from "./socket.js";
import { useSelector } from "react-redux";
import axios from "./axios";

export function Chat() {
    const chatMessages = useSelector(state => state && state.chatMessages);
    const usersOnline = useSelector(state => state && state.online);
    console.log("usersOnline in chat.js: ", usersOnline);
    console.log("chatMessages: ", chatMessages);

    const elemRef = useRef();

    useEffect(() => {
        console.log("Chat working");
        // console.log("elemRef:", elemRef);
        let { clientHeight, scrollTop, scrollHeight } = elemRef.current;
        // console.log("scroll top", scrollTop);
        // console.log("client height", clientHeight);
        // console.log("scroll height", scrollHeight);
        elemRef.current.scrollTop = scrollHeight - clientHeight;
        // console.log("elemRef.current.scrollTop", elemRef.current.scrollTop);
    }, [chatMessages]);

    const keyCheck = e => {
        if (e.key === "Enter") {
            e.preventDefault(); // stops enoying moving enter to new line
            // console.log("what the user is typing:", e.target.value);
            // console.log("which key user pressed:", e.keyCode);
            socket.emit("newmessage", e.target.value);
            e.target.value = "";
        }
    };
    const showProfile = a => {
        console.log("target: ", a);
        location.replace("/user/" + a);
    };
    return (
        // <div className="mainchatcontainer">
        <>
            <div className="bigchatcontainer">
                <div className="chat-container" ref={elemRef}>
                    {chatMessages &&
                        chatMessages
                            .slice(0)
                            .reverse()
                            .map((message, index) => {
                                return (
                                    <>
                                        <div
                                            className="messagecontainer"
                                            key={index}
                                        >
                                            <div className="containerchatpicture">
                                                {message.picture_url && (
                                                    <img
                                                        src={
                                                            message.picture_url
                                                        }
                                                        className="chatpicture"
                                                    />
                                                )}
                                                {!message.picture_url && (
                                                    <img
                                                        src="./default.jpg"
                                                        className="chatpicture"
                                                    />
                                                )}
                                            </div>

                                            <div className="textcontainerinchat">
                                                <div className="firstlastinchat">
                                                    <div className="firstlast">
                                                        {message.first}
                                                        &nbsp;
                                                        {message.last}
                                                    </div>
                                                    {new Date(
                                                        message.created_at
                                                    ).toLocaleDateString(
                                                        "en-US",
                                                        {
                                                            hour: "2-digit",
                                                            minute: "2-digit"
                                                        }
                                                    )}
                                                </div>
                                                <div className="textinchat">
                                                    {message.message}
                                                </div>
                                            </div>
                                        </div>
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
            <div className="onlineuserscontainer">
                <div className="online">
                    {usersOnline &&
                        usersOnline.map((online, index) => {
                            return (
                                <div className="onlineusers" key={index}>
                                    <div className="containerchatpicture">
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
                                    <div className="onlinefirstlast">
                                        {online.first} &nbsp;
                                        {online.last}
                                    </div>
                                </div>
                            );
                        })}
                </div>
                <div className="flexfullcolumn">
                    <div className="edit">Users Online</div>
                </div>
            </div>
        </>
        // </div>
    );
}
