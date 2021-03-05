import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Typography, IconButton, Divider, Tooltip } from '@material-ui/core';
import { DirectionsRun, Layers, AccountTree, Flag, CalendarToday, Fingerprint, RecentActors, Delete, Visibility, VisibilityOff } from '@material-ui/icons';
import ProgressBar from './ProgressBar'
import Moment from 'react-moment';

const useStyles = makeStyles(() => ({
    cardButton: {
        height: "12px",
        width: "12px",
        margin: "auto 5px",
    },
    row: {
        overflowY: "hidden",
        display: "flex",
        flexDirection: "row",
    },
    vertAlign: {
        margin: "auto 5px"
    },
}));

export default function PreviewContainer(props) {

    const classes = useStyles();

    return (
        <React.Fragment>

            <Grid item xs={12}>
                <div className={classes.row}>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            width: "100%",
                            justifyContent: "space-between",
                        }}>
                        <div style={{
                            display: "inherit",
                            flexDirection: "inherit",
                        }}>
                            <Tooltip title="Bug ID">
                                <Fingerprint className={classes.vertAlign} />
                            </Tooltip>
                            <Typography>
                                {props.bug.bug_id}
                            </Typography>
                        </div>
                        {
                            props.areDataManipButtonsVisible ?
                                <div className={classes.row}>
                                    <IconButton
                                        className={classes.cardButton}
                                        onClick={() => { props.onDelete(props.bug.bug_id); props.setCanEdit(false); }}>
                                        <Delete />
                                    </IconButton>
                                    <IconButton
                                        className={classes.cardButton}
                                        onClick={() => { props.setCanExpand(!props.canExpand); }}>
                                        { props.canExpand ? <VisibilityOff /> : <Visibility/>}
                                    </IconButton>
                                </div>
                                :
                                <span/>
                        }
                    </div>
                </div>
                <Divider />
            </Grid>
            <Grid item xs={12}>
                <div className={classes.row}>
                        <div>
                            {props.bug.type === "RTM" && <Tooltip title="Run Time Error"><DirectionsRun className={classes.vertAlign} /></Tooltip>}
                            {props.bug.type === "CMP" && <Tooltip title="Compilation Error"><Layers className={classes.vertAlign} /></Tooltip>}
                            {props.bug.type === "LGC" && <Tooltip title="Logic Error"><AccountTree className={classes.vertAlign} /></Tooltip>}
                        </div>
                    <Typography style={{ textOverflow: "ellipsis", overflow: "hidden", whiteSpace: (props.canExpand ? "normal" : "nowrap") }}  >{props.bug.report_comment}</Typography>
                </div>
                <Divider />
            </Grid>

            <Grid item xs={12}>
                <div className={classes.row}>
                    <Tooltip title="Date Reported">
                        <CalendarToday className={classes.vertAlign} />
                    </Tooltip>
                    <Moment format="MMMM Do, YYYY - h:mm:ss A">{props.bug.dt_reported}</Moment>
                </div>
                <Divider />
            </Grid>
            <Grid item xs={12}>
                <div className={classes.row}>
                    <Tooltip title="Reportee">
                        <RecentActors className={classes.vertAlign} />
                    </Tooltip>
                    <Typography>
                        {props.bug.reportee}
                    </Typography>
                </div>
                <Divider />
            </Grid>
            <Grid item xs={12}>
                <div className={classes.row}>
                    <Tooltip title="Progress">
                        <Flag className={classes.vertAlign} />
                    </Tooltip>
                    {
                        props.bug.progress_avg > 0 ?
                            <>
                                <ProgressBar value={Math.floor(props.bug.progress_avg)} />
                                <Typography style={{ marginLeft: "auto" }}>{`${((props.bug.progress_avg / 255) * 100).toFixed(2)}%`}</Typography>
                            </>
                            :
                            <Typography>No Progress</Typography>
                    }
                </div>
                <Divider />
            </Grid>
        </React.Fragment>
    );
}