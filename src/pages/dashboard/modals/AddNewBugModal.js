import React, { useState, useContext, useCallback, useEffect } from 'react';
import axios from 'axios'
import { Select, MenuItem, TextField, Typography, Grid, Modal, Button, Paper } from '@material-ui/core'
import { AuthContext } from '../../../util/AuthContext';
import { backendUrl, getNewToken } from "../../../util/AuthUtil"
import {getAllUsernames} from '../../../util/CommonAPIs';

export default function AddNewBugModal(props) {

    // Get the necessary global variables
    const { accessToken, setAccessToken, refreshToken, username } = useContext(AuthContext);

    // All existing usernames to select from.
    const [usernames, setUsernames] = useState([]);

    // Current selected username
    const [selectedUsername, setSelectedUsername] = useState(username);

    // Current selected bug type
    const [selectedType, setSelectedType] = useState("CMP");

    // Current date selected
    const [selectedDate, setSelectedDate] = useState(null);

    // Current time selected
    const [selectedTime, setSelectedTime] = useState(null);

    // Current report comment selected
    const [selectedReportComment, setSelectedReportComment] = useState(null);

    // Date error if field is empty.
    const [dateError, setDateError] = useState(false);

    // Time error if field is empty.
    const [timeError, setTimeError] = useState(false);

    // Report comment error if field is empty.
    const [reportCommentError, setReportCommentError] = useState(false);

    // API request to create a new bug.
    const createNewBug = useCallback((bug) => {
        axios({
            method: 'post',
            url: backendUrl + '/api/post/bug/new',
            data: bug,
            headers: { authorization: "Bearer " + accessToken }
        }).then(() => {
        }).catch(async () => {
            setAccessToken(await getNewToken(refreshToken));
        })
    }, [accessToken, setAccessToken, refreshToken]);

    // This deals with preparing the data for submission. It also ensures that all fields are not empty. 
    const handleSubmit = () => {
        
        // Debugging block.
        if(false)
        {
            console.log("Username: " + selectedUsername);
            console.log("Type:     " + selectedType);
            console.log("Date:     " + selectedDate);
            console.log("Time:     " + selectedTime);
            console.log("Comment:  " + selectedReportComment);
        }

        let canSubmit = true;

        // Check each individual text field for emptiness
        if (selectedDate === "" || selectedDate === null) {
            canSubmit = false;
            setDateError(true);
        } else {
            setDateError(false);
        }

        if (selectedTime === "" || selectedTime === null) {
            canSubmit = false;
            setTimeError(true);
        } else {
            setTimeError(false);
        }

        if (selectedReportComment === "" || selectedReportComment === null) {
            canSubmit = false;
            setReportCommentError(true);
        } else {
            setReportCommentError(false);
        }

        // If all inputs are filled, make the API request.
        if (canSubmit) {
           
            // API object that fits with the backend's specifications.
            let bugApiObject = {
                type: selectedType,
                dt_reported: `${selectedDate} ${selectedTime}:00`,
                report_comment: selectedReportComment,
                reportee: username
            }

            createNewBug(bugApiObject);
            props.onClose();
        }
    }

    // Get the user name for the select menu on load up.
    useEffect(() => {getAllUsernames(accessToken, setAccessToken, refreshToken, (data) => {setUsernames(data)}); }, [accessToken, setAccessToken, refreshToken]);

    const AddModalBody = (
        <Paper className={props.modalStyles.bodyStyle}>
            <Typography variant="h4">New Bug</Typography>
            <Grid container spacing={1}>
                <Grid item xs={6} className={props.modalStyles.fieldRow}>
                    <Typography className={props.modalStyles.fieldRowItems} variant="h6">Reportee</Typography>
                </Grid>
                <Grid item xs={6} className={props.modalStyles.fieldRow}>
                    <Select
                        value={selectedUsername}
                        onChange={e => { setSelectedUsername(e.target.value) }}
                        >
                        {
                            usernames.map((username, index) =>
                            <MenuItem key={index} value={username.username}>{username.username}</MenuItem>
                            )
                        }
                    </Select>
                </Grid>
                <Grid item xs={6} className={props.modalStyles.fieldRow}>
                    <Typography className={props.modalStyles.fieldRowItems} variant="h6">Type</Typography>
                </Grid>
                <Grid item xs={6} className={props.modalStyles.fieldRow}>
                    <Select
                        value={selectedType}
                        onChange={e => { setSelectedType(e.target.value) }}
                        >
                        <MenuItem value="CMP">CMP - Compilation Error</MenuItem>
                        <MenuItem value="LGC">LGC - Logic Error</MenuItem>
                        <MenuItem value="RTM">RTM - Runtime Error</MenuItem>
                    </Select>
                </Grid>
                <Grid item xs={6} className={props.modalStyles.fieldRow}>
                    <Typography className={props.modalStyles.fieldRowItems} variant="h6">Date Reported</Typography>
                </Grid>
                <Grid item xs={6} className={props.modalStyles.fieldRow}>
                    <TextField error={dateError} type="date" onBlur={e => { setSelectedDate(e.target.value) }} className={props.modalStyles.fieldRowItems} />
                </Grid>
                <Grid item xs={6} className={props.modalStyles.fieldRow}>
                    <Typography className={props.modalStyles.fieldRowItems} variant="h6">Time Reported</Typography>
                </Grid>
                <Grid item xs={6} className={props.modalStyles.fieldRow}>
                    <TextField error={timeError} type="time" onBlur={e => { setSelectedTime(e.target.value) }} className={props.modalStyles.fieldRowItems} />
                </Grid>
                <Grid item xs={6} className={props.modalStyles.fieldRow}>
                    <Typography className={props.modalStyles.fieldRowItems} variant="h6">Report Comment</Typography>
                </Grid>
                <Grid item xs={6} className={props.modalStyles.fieldRow}>
                    <TextField error={reportCommentError} multiline onBlur={e => { setSelectedReportComment(e.target.value) }} className={props.modalStyles.fieldRowItems} />
                </Grid>
                <Grid item xs={6} align="center">
                    <Button onClick={() => props.onClose()}>Cancel</Button>
                </Grid>
                <Grid item xs={6} align="center">
                    <Button onClick={handleSubmit}>Submit</Button>
                </Grid>
            </Grid>
        </Paper>
    );

    return (
        <Modal
            open={props.open}
            onClose={() => props.onClose()}
            >
            {AddModalBody}
        </Modal>
    );
}