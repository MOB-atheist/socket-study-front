import { combineReducers, createStore } from "@reduxjs/toolkit";
import persistReducer from "redux-persist/es/persistReducer";
import persistStore from "redux-persist/es/persistStore";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web

const messages = (state = [], action) => {
    switch (action.type) {
        case "ADD_MESSAGE":
            return [...state, action.payload];
        default:
            return state;
    }
};

const user = (state = { id: null, nickName: "" }, action) => {
    switch (action.type) {
        case "CREATE_USER":
            return action.payload;
        case "CHANGE_USER":
            return { ...state, ...action.payload };
        default:
            return state;
    }
};

const persistConfig = {
    key: "root",
    storage,
    whitelist: ["user"]
};

const reducer = combineReducers({
    messages,
    user
});

const persistedReducer = persistReducer(persistConfig, reducer);
const store = createStore(persistedReducer);
let persistor = persistStore(store)




export { store, persistor };
