import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    body: {
        background: "#a3b5cf",
        height: "1000px"     
    },
}));

export default function Home(){

    const classes = useStyles();    

    return(
        <div className={classes.body}>
            Welcome to a bug tracker application written by Noah Rix
        </div>
    );
}