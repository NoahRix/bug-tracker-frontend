import React, { useState, useContext, useEffect, useCallback } from 'react';
import axios from 'axios';
import { makeStyles } from '@material-ui/core';
import { Grid, TextField, Typography, Button, Select, MenuItem } from '@material-ui/core';
import { AuthContext } from '../../../util/AuthContext';
import { getNewToken, backendUrl } from '../../../util/AuthUtil';
import { getAllUsernames } from '../../../util/CommonAPIs';

const useStyles = makeStyles(() => ({
    text: {
        whiteSpace: "nowrap",
    },
    cell: {
        textAlign: "center",
    },
    field: {
        width: "75%",
    },
    select: {
        marginLeft: "10px",
    },
    selectField: {
        width: "75%",
        margin: "auto",
        display: "flex",
        flexDirection: "row",
    }
}));

export default function AddNewBugAssignmentForm(props) {

    const classes = useStyles();

    // Get all of the necessary global variables.
    const { accessToken, setAccessToken, refreshToken, username } = useContext(AuthContext);

    // Array of username for select menu
    const [usernames, setUsernames] = useState([]);
    
    // Hooks to hold the input data.
    const [assignee, setAssignee] = useState(username);
    const [startDate, setStartDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endDate, setEndDate] = useState("");
    const [endTime, setEndTime] = useState("");
    const [progress, setProgress] = useState("");
    const [role, setRole] = useState("");
    
    // Booleans for red underlining of the text fields to indicate empty input. 
    const [startDateError, setStartDateError] = useState(false);
    const [startTimeError, setStartTimeError] = useState(false);
    const [endDateError, setEndDateError] = useState(false);
    const [endTimeError, setEndTimeError] = useState(false);
    const [roleError, setRoleError] = useState(false);
    const [progressError, setProgressError] = useState(false);
    
    // Sql server error message from the backend to be show at the bottom of the form.
    const [serverError, setServerError] = useState("");

    // Load the usernames to be mapped in the select menu.
    useEffect(() => {
        getAllUsernames(accessToken, setAccessToken, refreshToken, (data) => {
            setUsernames(data);
        })
    }, [accessToken, setAccessToken, refreshToken])

    // This handles my sql error numbers to set the appropriate error message
    // May migrate this feature in the backend.
    const handleSqlErrorNo = useCallback((errno) => {
        switch (errno) {
            case 1062:
                setServerError(`${assignee} is already assigned to this bug.`);
                break;
            case 1264:
                setServerError("Progress must be a number in the range 0 - 255.");
                break;
            default:
                setServerError("");
                props.onClose();
                break;
        }
    },[assignee, props]);

    // API request to create a new bug assignment.
    const addNewBugAssignment = useCallback((bugAssignment) => {
        axios({
            method: 'post',
            url: backendUrl + '/api/post/bug_assignment/new',
            data: bugAssignment,
            headers: { authorization: "Bearer " + accessToken }
        }).then((res) => {
            console.log(parseInt(res.data.errno));
            handleSqlErrorNo(parseInt(res.data.errno));
        }).catch(async () => {
            setAccessToken(await getNewToken(refreshToken));
        })
    }, [accessToken, setAccessToken, refreshToken, handleSqlErrorNo]);

    // This deals with preparing the data for submission. It also ensures that all fields are not empty. 
    const handleSubmit = () => {
        
        // Debugging for the input fields.
        if(false)
        {
            console.log("Start Date: " + startDate);
            console.log("Start Time: " + startTime);
            console.log("End Date    " + endDate);
            console.log("End Time:   " + endTime);
            console.log("Role:       " + role);
            console.log("Progress:   " + progress);
        }
        
        let canSubmit = true;

        // Check each individual text field for emptiness
        if (startDate === "" || startDate === null) { canSubmit = false; setStartDateError(true);
        } else {
            setStartDateError(false);
        }

        if (startTime === "" || startTime === null) {
            canSubmit = false;
            setStartTimeError(true);
        } else {
            setStartTimeError(false);
        }

        if (endDate === "" || endDate === null) {
            canSubmit = false;
            setEndDateError(true);
        } else {
            setEndDateError(false);
        }

        if (endTime === "" || endTime === null) {
            canSubmit = false;
            setEndTimeError(true);
        } else {
            setEndTimeError(false);
        }

        if (role === "" || role === null) {
            canSubmit = false;
            setRoleError(true);
        } else {
            setRoleError(false);
        }

        if (progress === "" || progress === null) {
            canSubmit = false;
            setProgressError(true);
        } else {
            setProgressError(false);
        }

        // If all inputs are filled, make the API request.
        if (canSubmit) {

            // API object that fits with the backend's specifications.
            let bugAssignmentApiObject = {
                assignee: assignee,
                bug_id: props.bug.bug_id,
                dt_start: `${startDate} ${startTime}:00`,
                dt_end: `${endDate} ${endTime}:00`,
                progress: progress,
                role: role
            }
            
            addNewBugAssignment(bugAssignmentApiObject);
            props.onUpdateBugAssignments();
        }
    }

    
    // Simplified textfield sub component
    const TextFieldItem = (tag, type, error, onBlur) => {
        return (
            <Grid className={classes.cell} item xs={12}>
                <TextField
                    type={type}
                    onBlur={onBlur}
                    className={classes.field}
                    error={error}
                    InputProps={{
                        startAdornment: (
                            <Typography className={classes.text}>{tag}&nbsp;</Typography>
                        ),
                    }} />
            </Grid>
        );
    };

    return (
        <Grid container>
            <Grid className={classes.cell} item xs={12}>
                <div className={classes.selectField}>
                    <Typography>Assignee: </Typography>
                    <Select
                        value={assignee}
                        className={classes.select}
                        onChange={e => setAssignee(e.target.value)}
                    >
                        {
                            usernames.map((username, index) =>
                                <MenuItem key={index} value={username.username}>{username.username}</MenuItem>
                            )
                        }
                    </Select>
                </div>
            </Grid>
            {TextFieldItem("Start Date:", "date", startDateError, e => setStartDate(e.target.value))}
            {TextFieldItem("Start Time:", "time", startTimeError, e => setStartTime(e.target.value))}
            {TextFieldItem("End Date:", "date", endDateError, e => setEndDate(e.target.value))}
            {TextFieldItem("End Time:", "time", endTimeError, e => setEndTime(e.target.value))}
            {TextFieldItem("Role:", "text", roleError, e => setRole(e.target.value))}
            {TextFieldItem("Progress:", "text", progressError, e => setProgress(e.target.value))}
            <Grid className={classes.cell} item xs={6}>
                <Button onClick={props.onClose}>Cancel</Button>
            </Grid >
            <Grid className={classes.cell} item xs={6}>
                <Button onClick={handleSubmit}>Submit</Button>
            </Grid >
            <Grid className={classes.cell} item xs={12}>
                <Typography style={{ color: "red" }}>{serverError}</Typography>
            </Grid >
        </Grid>
    );
}