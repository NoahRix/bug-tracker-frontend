import React, { useState } from 'react';
import { Typography, IconButton, List, ListItem, ListItemAvatar, Avatar, TextField, Collapse, CardContent } from '@material-ui/core';
import { Clear, Edit, Check, Delete, Add } from '@material-ui/icons';
import AddNewBugAssignmentForm from './AddNewBugAssignmentForm';
import Moment from 'react-moment';

export default function BugAssignments(props) {

    // Flag for opening/closing the add a new bug assignment form.
    const [openNewBugAssingmentForm, setOpenNewBugAssingmentForm] = useState(false);

    return (
        <List>
            <div className={props.classes.row}>
                <IconButton className={props.classes.cardButton} onClick={() => props.setCanEdit(!props.canEdit)}>
                    {props.canEdit ? <Clear /> : <Edit />}
                </IconButton>
                {
                    props.canEdit ?
                        <div className={props.classes.row}>
                            <IconButton
                                className={props.classes.cardButton}
                                onClick={() => { props.submitChange(); props.setCanEdit(false); props.onRefreshBugs(); }}>
                                <Check />
                            </IconButton>
                            <IconButton
                                className={props.classes.cardButton}
                                onClick={() => setOpenNewBugAssingmentForm(!openNewBugAssingmentForm)}>
                                <Add />
                            </IconButton>
                        </div>
                        :
                        <span />}
            </div>
            <Collapse in={openNewBugAssingmentForm} timeout="auto" unmountOnExit>
                <CardContent>
                    <AddNewBugAssignmentForm
                        bug={props.bug}
                        onClose={() => setOpenNewBugAssingmentForm(false)}
                        onUpdateBugAssignments={props.onUpdateBugAssignments}
                    />
                </CardContent>
            </Collapse>
            {
                props.bugAssignments.map((bugAssignment, index) => {
                    props.progresses[index] = bugAssignment.progress;

                    return <div key={index}>
                        <ListItem alignItems="flex-start">
                            {
                                props.canEdit ?
                                    <ListItemAvatar>
                                        <IconButton
                                            className={props.classes.cardButton}
                                            onClick={() => { props.onDelete(bugAssignment.assignee); props.onRefreshBugs(); }}>
                                            <Delete />
                                        </IconButton>
                                    </ListItemAvatar>
                                    :
                                    <ListItemAvatar>
                                        <Avatar style={{ margin: "auto" }} alt={bugAssignment.assignee} src="/static/images/avatar/1.jpg" />
                                    </ListItemAvatar>
                            }

                            <List>
                                <ListItem>
                                    <Typography><b>Assignee: </b>{bugAssignment.assignee}</Typography><br />
                                </ListItem>
                                <ListItem>
                                    <Typography><b>Role: </b>{bugAssignment.role}</Typography><br />
                                </ListItem>
                                <ListItem>
                                    <Typography><b>Start Date: </b><Moment format="YYYY-MM-DD HH:MM:SS">{bugAssignment.dt_start}</Moment></Typography><br />
                                </ListItem>
                                <ListItem>
                                    <Typography><b>End Date: </b><Moment format="YYYY-MM-DD HH:MM:SS">{bugAssignment.dt_end}</Moment></Typography><br />
                                </ListItem>
                                <ListItem>
                                    {
                                        props.canEdit ?
                                            <>
                                                <Typography><b>Progress: </b></Typography>
                                                <TextField
                                                    placeholder={bugAssignment.progress.toString()}
                                                    onBlur={e => { props.progresses[index] = e.target.value; }}
                                                />
                                            </>
                                            :
                                            <Typography><b>Progress: </b>{bugAssignment.progress}</Typography>

                                    }
                                </ListItem>
                            </List>

                        </ListItem>
                    </div>
                })
            }
        </List>
    );
}
