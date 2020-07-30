export default function reducer(state = {}, action) {
    if (action.type === "RECEIVE_USERS") {
        // console.log("reducer!!! RECEIVE_USERS");
        state = { ...state, friendsWannabes: action.friendsWannabes };
        //map for changing everything arr
        //filter for filtering arr
        //concat add to arr together
        //... spread operator copy of arr and obj
        //Object.assign - make copier of objects
        // you will often have to choose between copying state using either ... or Object.assign... I encourage you to choose ...
    }
    if (action.type === "UNFRIEND") {
        // console.log("reducer!!! UNFRIEND");
        // console.log("state before: ", state);

        state = {
            ...state,
            friendsWannabes: state.friendsWannabes.filter(
                friend => friend.id != action.user_id
            )
        };

        // console.log("state after: ", state);
    }

    if (action.type === "ACCEPT_FRIEND") {
        // console.log("reducer!!! ACCEPT_FRIEND");
        // console.log("state before: ", state);
        state = {
            ...state,
            friendsWannabes: state.friendsWannabes.map(friend => {
                if (friend.id == action.user_id) {
                    return {
                        ...friend,
                        accepted: true
                    };
                }
                return friend;
            })
        };

        // state = {
        //     ...state,
        //     friends: state.friends.map(friend => {
        //         if (friend.id == action.id) {
        //             return {
        //                 ...friend,
        //                 accepted: true
        //             };
        //         }
        //         return friend;
        //     })
        // };

        // console.log("state after: ", state);

        //map for changing everything arr
        //filter for filtering arr
        //concat add to arr together
        //... spread operator copy of arr and obj
        //Object.assign - make copier of objects
        // you will often have to choose between copying state using either ... or Object.assign... I encourage you to choose ...
    }
    if (action.type == "GET_MESSAGES") {
        // console.log("GET_MESSAGES reducer");
        // console.log("msg 4:", action.messages);
        state = {
            ...state,
            chatMessages: action.messages
        };
    }
    if (action.type == "NEW_MESSAGE") {
        // console.log("NEW_MESSAGES reducer");
        // console.log("action.message:", action.message);

        state = {
            ...state,
            chatMessages: [action.message].concat(state.chatMessages)
        };
    }
    // console.log("state in reducer right after returning: ", state);
    if (action.type == "USERS_ONLINE") {
        console.log("USERS_ONLINE action.online:", action.online);
        state = {
            ...state,
            online: action.online
        };
    }
    return state;
}
