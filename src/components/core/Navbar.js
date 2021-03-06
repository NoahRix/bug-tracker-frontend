import React, { useContext, useRef, useState } from 'react';
import axios from 'axios';
import { AppBar, Toolbar, Typography, Button, IconButton, CircularProgress } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { AuthContext } from '../../util/AuthContext';
import { backendUrl, getNewToken } from '../../util/AuthUtil';
import { RotateLeft } from '@material-ui/icons';
import { CountdownCircleTimer } from "react-countdown-circle-timer";

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


  const classes = useStyles();

  const { accessToken, refreshToken, setRefreshToken, setAccessToken, username, isAuthed, setIsAuthed } = useContext(AuthContext);

  const [canResetDataBase, setCanResetDatabase] = useState(true);
  const [progress, setProgress] = useState(0);

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

  const handleResetDatabase = () => {
    axios({
      method: 'post',
      url: backendUrl + '/api/post/auth/reset-database',
      headers: { authorization: "Bearer " + accessToken }
    }).then((res) => {
      console.log("It worked!");
    }).catch(async () => {
      setAccessToken(await getNewToken(refreshToken));
    })
  }

  React.useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) => (prevProgress >= 100 ? 0 : prevProgress + 10));
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <AppBar style={{ backgroundColor: "#333" }} position="static">
      <Toolbar>
        <Typography variant="h6" className={classes.title}>
          Bug Tracker
        </Typography>
        {
          isAuthed &&
          <>
            {
              canResetDataBase ?
                <IconButton onClick={() => {handleResetDatabase(); setCanResetDatabase(false);}}><RotateLeft style={{ color: "white" }} /></IconButton>
                :
                <div style={{ marginRight: "16px" }}>
                  <CountdownCircleTimer
                    size={17}
                    trailStrokeWidth={2}
                    strokeWidth={2}
                    isPlaying={!canResetDataBase}
                    duration={15}
                    onComplete={() => setCanResetDatabase(true)}
                    colors={[["#333333", 0.33]]} >
                  </CountdownCircleTimer>
                </div>
            }
          </>
        }

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