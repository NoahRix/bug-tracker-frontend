import React, { useContext, useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Paper, Grow, Collapse, CardContent } from '@material-ui/core';
import { AuthContext } from '../../../util/AuthContext';
import { backendUrl, getNewToken } from "../../../util/AuthUtil"
import PreviewContainer from './PreviewContainer';
import BugAssignments from './BugAssignments'

const useStyles = makeStyles(() => ({
    body: {
        display: "flex",
        flexDirection: "column",
        width: "95%",
        padding: "10px",
    },
    row: {
        overflowY: "hidden",
        display: "flex",
        flexDirection: "row",
    },
}));

export default function MainBody(props) {

    // Style for the detail cards.
    const classes = useStyles();

    // Get the necessary global variables
    const { accessToken, setAccessToken, refreshToken } = useContext(AuthContext);

    // Flag for show data manipualtion buttons on the detail card.
    const [areDataManipButtonsVisible, setAreDataManipButtonsVisible] = useState(null);

    // Use for expanding a selected detail card.
    const [canExpand, setCanExpand] = useState(false);

    // Flag for editing fields on card
    const [canEdit, setCanEdit] = useState(false);

    //bug assingments array for one card
    const [bugAssignments, setBugAssignments] = useState([]);

    // Capture array of progresses that is populated in the DOM
    let progresses = []

    // API request to get all of the bugs with progress.
    const getBugAssignments = useCallback((bug_id) => {
        axios({
            method: 'get',
            url: backendUrl + '/api/get/bug_assignment/by-bug-id',
            params: { bug_id },
            headers: { authorization: "Bearer " + accessToken }
        }).then((res) => {
            setBugAssignments(res.data);
        }).catch(async (err) => {
            console.log("ERROR!");
            console.log(err);
            setAccessToken(await getNewToken(refreshToken));
        })
    }, [accessToken, setAccessToken, refreshToken]);

    // API request to a row of a bug assignment.
    const updateBugAssignment = useCallback((bug_assignment) => {
        axios({
            method: 'post',
            url: backendUrl + '/api/post/bug_assignment/update',
            data: { bug_assignment },
            headers: { authorization: "Bearer " + accessToken }
        }).then((res) => {
        }).catch(async (err) => {
            setAccessToken(await getNewToken(refreshToken));
        })
    }, [accessToken, setAccessToken, refreshToken]);

    //API request that deletes a bug assignment
    const deleteBugAssignment = useCallback((assignee) => {
        console.log("Deleting bug assignment");
        axios({
            method: 'post',
            url: backendUrl + '/api/post/bug_assignment/delete',
            data: { assignee, bug_id: props.bug.bug_id },
            headers: { authorization: "Bearer " + accessToken }
        }).then((res) => {
        }).catch(async (err) => {
            setAccessToken(await getNewToken(refreshToken));
        })
    }, [accessToken, setAccessToken, refreshToken, props.bug.bug_id]);

    // Load the bug assignment immediately.
    useEffect(() => {
        getBugAssignments(props.bug.bug_id);
    }, [props.bug, getBugAssignments])

    // Submit changes of assignments
    const submitChange = () => {

        // API object for the backend to update the bug's progress.
        let ba = { progress: null, bug_id: null, assignee: null, }

        // Loop through each bug assignment to get the assignee's progress.
        // This goes through each assignee to get a full update on each progress.
        bugAssignments.forEach((bugAssignment, index) => {

            // Get the progress from the capture array from the DOM. 
            ba.progress = progresses[index];
            
            // The bug id will always be the same.
            ba.bug_id = props.bug.bug_id;
            
            // Get the current assignee (username).
            ba.assignee = bugAssignment.assignee;

            //Send the API object top the backend.
            updateBugAssignment(ba);

            // Reset the object for the next assignee.
            ba = {};
        });

        // When all done, retrieve the new bug assignments for re rendering. 
        getBugAssignments(props.bug.bug_id);
    }


    return (
        <Grid item xs={12} sm={6} md={6} lg={4} xl={4}>
            <Grow in={true}>
                <Paper
                    id="card"
                    className={classes.body}
                    onMouseOver={() => { setAreDataManipButtonsVisible(true); }}
                    onMouseLeave={() => { setAreDataManipButtonsVisible(false); }}
                >
                    <Grid container spacing={1}>
                        <PreviewContainer
                            areDataManipButtonsVisible={areDataManipButtonsVisible}
                            setCanEdit={setCanEdit}
                            setCanExpand={setCanExpand}
                            canExpand={canExpand}
                            {...props}
                        />
                        <Grid item xs={12}>
                            <Collapse in={canExpand} timeout="auto" unmountOnExit>
                                <CardContent>
                                    <BugAssignments
                                        classes={classes}
                                        key={props.bug.bug_id}
                                        setCanEdit={setCanEdit}
                                        canEdit={canEdit}
                                        submitChange={submitChange}
                                        bugAssignments={bugAssignments}
                                        progresses={progresses}
                                        onRefreshBugs={props.onRefreshBugs}
                                        onDelete={deleteBugAssignment}
                                        onUpdateBugAssignments={() => {getBugAssignments(props.bug.bug_id); props.onRefreshBugs();}}
                                        bug={props.bug}
                                    />
                                </CardContent>
                            </Collapse>
                        </Grid>
                    </Grid>
                </Paper>
            </Grow>
        </Grid>
    );
}