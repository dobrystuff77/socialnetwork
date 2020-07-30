import React from "react";
import ReactDOM from "react-dom";
import Welcome from "./welcome";
import App from "./app";
///////////////////////////////////////////////////////////////////////////////
// REDUX
import { Provider } from "react-redux";

import { createStore, applyMiddleware } from "redux";
import reduxPromise from "redux-promise";
import { composeWithDevTools } from "redux-devtools-extension";
import reducer from "./reducers";
const store = createStore(
    reducer,
    composeWithDevTools(applyMiddleware(reduxPromise))
);
////////////////////////////////////////////////////////////////////////////////
import { init } from "./socket";
//////////
let elem;

if (location.pathname == "/welcome") {
    console.log("location.pathname == /welcome");
    elem = <Welcome />;
} else {
    init(store);
    elem = (
        <Provider store={store}>
            <App />
        </Provider>
    );
}

ReactDOM.render(elem, document.querySelector("main"));
