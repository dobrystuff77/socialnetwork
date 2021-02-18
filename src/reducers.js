export default function reducer(state = {}, action) {
    if (action.type === "RECEIVE_USERS") {
        state = { ...state, friendsWannabes: action.friendsWannabes };
    }
    if (action.type === "UNFRIEND") {
        state = {
            ...state,
            friendsWannabes: state.friendsWannabes.filter(
                friend => friend.id != action.user_id
            )
        };
    }

    if (action.type === "ACCEPT_FRIEND") {
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

    }
    
    if (action.type == "GET_MESSAGES") {
        state = {
            ...state,
            chatMessages: action.messages
        };
    }

    if (action.type == "NEW_MESSAGE") {

        state = {
            ...state,
            chatMessages: [action.message].concat(state.chatMessages)
        };
    }

    if (action.type == "USERS_ONLINE") {
        console.log("USERS_ONLINE action.online:", action.online);
        state = {
            ...state,
            online: action.online
        };
    }
    return state;
}
