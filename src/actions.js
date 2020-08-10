import axios from "./axios";

export async function getStatus() {
    const { data } = await axios.get("/friends-wonnabes");
    console.log("data from GET/friends-wonnabes: ", data);

    return {
        type: "RECEIVE_USERS",
        friendsWannabes: data
    };
}

export async function unfriend(user_id) {
    const { data } = await axios.post("/cancel/" + user_id + ".json");
    console.log("data from POST/cancel/ ", data);

    return {
        type: "UNFRIEND",
        user_id
    };
}

export async function acceptFriend(user_id) {
    console.log("ACCEPT_FRIEND");
    const { data } = await axios.post("/update/" + user_id + ".json");
    console.log("data from POST/update/", data);

    return {
        type: "ACCEPT_FRIEND",
        user_id
    };
}

export async function chatMessages(messages) {
    console.log("msg:", messages);
    return {
        type: "GET_MESSAGES",
        messages
    };
}

export async function newMessage(message) {
    console.log("new message!!!:", message);
    return {
        type: "NEW_MESSAGE",
        message
    };
}

export async function usersOnline(online) {
    return {
        type: "USERS_ONLINE",
        online
    };
}
