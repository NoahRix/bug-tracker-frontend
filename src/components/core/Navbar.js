import React, { useContext } from 'react';
import axios from 'axios';
import { AppBar, Toolbar, Typography, Button } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { AuthContext } from '../../util/AuthContext';
import { backendUrl } from '../../util/AuthUtil';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

export default function Navbar() {

  console.log("backendUrl: " + backendUrl);

  const classes = useStyles();

  const { setRefreshToken, setAccessToken, username, isAuthed, setIsAuthed } = useContext(AuthContext);

  const handleLogout = () => {
    axios({
      method: 'post',
      url: backendUrl + '/api/post/auth/logout',
      data: { username }
    }).then(() => {
      setIsAuthed(false);
      setAccessToken(null);
      setRefreshToken(null);
    })
  }

  return (
    <AppBar style={{ backgroundColor: "#333" }} position="static">
      <Toolbar>
        <Typography variant="h6" className={classes.title}>
          Bug Tracker
                </Typography>
        <Button to="/dashboard" component={Link} color="inherit">Dashboard</Button>
        {
          isAuthed ?
            <Button onClick={handleLogout} color="inherit">Logout</Button>
            :
            <Button to="/login" component={Link} color="inherit">Login</Button>
        }
      </Toolbar>
    </AppBar>
  );
}