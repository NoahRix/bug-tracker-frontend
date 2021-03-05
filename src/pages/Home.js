import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Paper } from '@material-ui/core';
import { findByLabelText } from '@testing-library/dom';

const useStyles = makeStyles((theme) => ({
    body: {
        background: "#a3b5cf",
        height: "1000px",
        display: "flex",
    },
    mainContent: {
        margin: "30px auto",
        padding: "10px",
        width: "300px",
        height: "280px",
        textAlign: "center",
        backgroundColor: "white",
        fontFamily: "Arial"
    },
}));

export default function Home() {

    const classes = useStyles();

    return (
        <div className={classes.body}>
            <Paper className={classes.mainContent}>
                <p>Welcome to my bug tracker application!</p>
                <p>Please note this is still a work in progress, so there might be a few bugs <b>*irony*</b>.</p>
                <p>To test the application, login as followed:</p>
                <p><b>Username: Boss</b></p>
                <p><b>Password: 1234</b></p>
                <p>Thank you for your time of checking out my bug tracker!</p>
            </Paper>
        </div>
    );
}