import React, { useState } from "react";
import {
    makeStyles,
    CssBaseline,
    Grid,
    Fab,
    Divider,
    List,
    ListItem,
    ListItemText,
    TextField,
    Paper
} from "@material-ui/core";
import { Send } from "@material-ui/icons";
import socketClient from "socket.io-client";
import {store} from "./store";
import { useSelector } from "react-redux";
import User from "./User";

const useStyles = makeStyles({
    chatSection: {
        width: "100%",
        height: "100%"
    },
    headBG: {
        backgroundColor: "#e0e0e0"
    },
    borderRight500: {
        borderRight: "1px solid #e0e0e0"
    },
    input: {
        padding: "20px",
        position: "fixed",
        bottom: 0
    }
});

const socket = socketClient("http://localhost:4000/", {
    cors: {
        origin: "*",
        methods: ["GET", "POST", "HEAD", "PUT", "PATCH", "DELETE"]
    }
});

socket.on("connect", socket => {
    console.log("socket connected");
});

socket.on("new-user", user => {
    console.log(user);
});

socket.on("new-message", message => {
  store.dispatch({
    type: "ADD_MESSAGE",
    payload: message
  })
});

function App() {
    const classes = useStyles();
    const [value, setValue] = useState("");

    const messages = useSelector(state => state.messages)
    const user = useSelector(state => state.user)

    const userId = "";

    const UserMessage = ({ id, message, time }) => (
        <ListItem key={id}>
            <Grid container>
                <Grid item xs={12}>
                    <ListItemText
                        align="right"
                        primary={message}
                    ></ListItemText>
                </Grid>
                <Grid item xs={12}>
                    <ListItemText align="right" secondary={time} />
                </Grid>
            </Grid>
        </ListItem>
    );

    const OthersMessage = ({ id, message, time }) => (
        <ListItem key={id}>
            <Grid container>
                <Grid item xs={12}>
                    <ListItemText align="left" primary={message}></ListItemText>
                </Grid>
                <Grid item xs={12}>
                    <ListItemText align="left" secondary={time} />
                </Grid>
            </Grid>
        </ListItem>
    );

    const onChange = e => {
        setValue(e.target.value);
    };

    const sendMessage = async() => {
      await socket.emit("message", { id: "",message: value, user: "" });
    };

    return (
        <React.Fragment>
            <CssBaseline />
            {user.id === null && <User />}
            <Grid container component={Paper} className={classes.chatSection}>
                <Grid item xs={12}>
                    <List className={classes.messageArea}>
                        {messages.map(
                            (message, index) => <UserMessage {...message} />
                        )}
                    </List>
                    <Divider />
                    <Grid container className={classes.input}>
                        <Grid item xs={11}>
                            <TextField
                                id="outlined-basic-email"
                                label="Type Something"
                                value={value}
                                onChange={onChange}
                                fullWidth
                            />
                        </Grid>
                        <Grid xs={1} align="right">
                            <Fab
                                color="primary"
                                aria-label="add"
                                onClick={sendMessage}
                            >
                                <Send />
                            </Fab>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </React.Fragment>
    );
}

export default App;
