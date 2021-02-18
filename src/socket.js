import * as io from "socket.io-client";
import { chatMessages, newMessage, usersOnline } from "./actions";

export let socket;

export const init = store => {
    if (!socket) {
        socket = io.connect();

        socket.on("newmessage", message => {
            store.dispatch(newMessage(message));
        });

        socket.on("getMessages", messages => {
            store.dispatch(chatMessages(messages));
        });

        socket.on("usersOnline", result => {
            store.dispatch(usersOnline(result));
        });
    }
};
