import * as io from "socket.io-client";
import { chatMessages, newMessage, usersOnline } from "./actions";

export let socket;

export const init = store => {
    if (!socket) {
        socket = io.connect();

        socket.on("newmessage", message => {
            store.dispatch(newMessage(message));
            // console.log("message:", message);
        });

        socket.on("getMessages", messages => {
            // console.log("msg 2:", messages);
            store.dispatch(chatMessages(messages));
        });

        socket.on("usersOnline", result => {
            console.log("usersOnline!!!:", result);
            // store.dispatch(chatMessages(messages));
            store.dispatch(usersOnline(result));
        });
    }
};
