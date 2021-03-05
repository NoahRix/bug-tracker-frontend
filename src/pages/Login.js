import React, { useState, useContext } from 'react'
import { AuthContext } from '../util/AuthContext'
import { backendUrl } from '../util/AuthUtil'
import { Button, Paper, TextField, Typography } from '@material-ui/core';
import axios from 'axios';

export default function Login(props) {

    const { setAccessToken, setRefreshToken, setIsAuthed, setUsername } = useContext(AuthContext);

    const [usernameInput, setUsernameInput] = useState("");
    const [passwordInput, setPasswordInput] = useState("");
    const [showError, setShowError] = useState(false);

    // This calls the login api to handle the validation messages.
    const handleSubmit = () => {
        axios({
            method: 'post',
            url: backendUrl + '/api/post/auth/login',
            data: { username: usernameInput, password: passwordInput }
        }).then(res => {

            //If the login failed.
            if (!res.data.isAuthed)
                setShowError(true);
            else {
                //Authorize the user. 
                setAccessToken(res.data.accessToken);
                setRefreshToken(res.data.refreshToken);
                setIsAuthed(res.data.isAuthed);
                setUsername(res.data.username);

                //Redirect to the dashboard
                props.history.push('/dashboard');
            }
        })
    }

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                height: "1000px",
                backgroundImage: "linear-gradient(to right, #606c88, #3f4c6b)"
            }}
        >
            <Paper
                style={{
                    margin: "0px 200px",
                    padding: "0px 20px",
                    minWidth: "200px",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        width: "200px",
                        margin: "auto",
                        padding: "30px 0px"
                    }}
                >
                    <TextField
                        onChange={e => setUsernameInput(e.target.value)}
                        label="Username">
                    </TextField>
                    <TextField
                        onChange={e => setPasswordInput(e.target.value)}
                        type="password"
                        label="Password">
                    </TextField>
                    <Button
                        onClick={handleSubmit}>
                        login
                </Button>
                    {
                        showError ?
                            <Typography
                                style={{
                                    textAlign: "center",
                                    color: "red"
                                }}
                            >
                                Invalid username or password.
                        </Typography>
                            :
                            <span />
                    }
                </div>
            </Paper>
        </div>
    );
}