import React, { useState } from "react";
import {
    makeStyles,
    Slide,
    Dialog,
    Grid,
    InputAdornment,
    IconButton,
    OutlinedInput,
    FormControl,
    Button
} from "@material-ui/core";
import socketClient from "socket.io-client";
import { store } from "./store";
import { useDispatch, useSelector } from "react-redux";
import { DoubleArrow } from "@material-ui/icons";

const useStyles = makeStyles(theme => ({
    paper: {
        height: "100%"
    },
    gridItem: {
        height: "calc( 50%)",
        position: "relative"
    },
    gridContainer: {
        height: `calc(100% - ${theme.spacing(1)}px)`,
        marginTop: theme.spacing(1)
    },
    textfield: {
        position: "absolute",
        top: "calc( 50% + 50px )",
        left: "5%",
        textAlign: "center",
        width: "calc( 100% - 10% ) !important"
    },
    input: {
        height: "100px",
        fontSize: "100px"
    },
    icon: {
        fontSize: "100px"
    }
}));

const socket = socketClient("http://192.168.0.199:4000/", {
    cors: {
        origin: "*",
        methods: ["GET", "POST", "HEAD", "PUT", "PATCH", "DELETE"]
    }
});

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function User() {
    const classes = useStyles();
    const [value, setValue] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();

    const nickTest = /^[a-z0-9_-]{3,15}$/;
    const passwordTest = /^[a-z0-9_-]{3,15}$/;

    const onChange = e => {
        setValue(e.target.value);
    };

    const onchangePassword = e => {
        setPassword(e.target.value);
    };

    const logIn = async () => {
        if (!nickTest.test(value)) {
            alert(
                "A username is a unique identifier given to accounts in websites and social media"
            );
            return
        }
    
        await socket.emit("verify-user", {
            nickName: value,
            password: password
        });

        socket.on("user-doesnt-exist", async(user) => {
            if(!passwordTest.test(password)){
                alert(
                    "Minimum eight characters, at least one upper case English letter, one lower case English letter, one number and one special character"
                );
                return
            }

            // dispatch({
            //     type: "CREATE_USER",
            //     payload: user
            // });
        })
    };

    return (
        <React.Fragment>
            <Dialog fullScreen open={true} TransitionComponent={Transition}>
                <Grid container spacing={3} className={classes.gridContainer}>
                    {/* <Grid item xs={12} className={classes.gridItem} /> */}
                    <Grid item xs={12} className={classes.gridItem}>
                        <FormControl
                            className={classes.textfield}
                            variant="outlined"
                        >
                            <OutlinedInput
                                id="standard-adornment-password"
                                type="text"
                                className={classes.input}
                                value={value}
                                onChange={onChange}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl
                            className={classes.textfield}
                            variant="outlined"
                        >
                            <OutlinedInput
                                id="standard-adornment-password"
                                type="password"
                                className={classes.input}
                                value={password}
                                onChange={onchangePassword}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            fullWidth
                            variant="outlined"
                            onClick={logIn}
                        />
                    </Grid>
                </Grid>
            </Dialog>
        </React.Fragment>
    );
}

export default User;
