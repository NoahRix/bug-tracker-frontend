import React from 'react';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    height: "50%",
    width: "100%",
  },
}));

export default function Footer(props) {

    const classes = useStyles();

    return (
        <div className={classes.root}>
            <Typography>Created by Noah Rix 2020 - 2021. For demonstration purposes.</Typography>
        </div>
    );
}