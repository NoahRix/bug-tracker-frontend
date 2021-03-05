import React, { useState, useContext } from 'react';
import DetailCard from './DetailCard/MainBody';
import { Grid, Button, Select, MenuItem } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { AuthContext } from '../../util/AuthContext'

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
    rowStyle: {
        display: "flex",
        flexDirection: "row"
    },
    pageControl: {
        marginBottom: "15px",
    }
}));

export default function PagedView({ bugs, onDelete, onRefreshBugs }) {

    const classes = useStyles();

    // Get the necessary global variables.
    const { searchQuery, dateReportedSortValue, progressSortValue } = useContext(AuthContext);

    // Pagination hooks.
    const [numberPerPage, setNumberPerPage] = useState(10);
    const [pageNumber, setPageNumber] = useState(1);
    
    // Total pages poosible based on the bugs array length.
    let totalPages = bugs.filter(bug => bug.report_comment.includes(searchQuery)).length / numberPerPage;
    
    // Page number number array to map the buttons.
    let pageNumbers = [];

    // Build an array of numbers so they can be mapped for the page buttons.
    for (let i = 0; i < totalPages; i++)
        pageNumbers.push(i + 1);

    // Page selector interface
    const PageControl = () => {
        return (
            <div className={classes.rowStyle}>
                {
                    pageNumbers.map((item) =>
                        <Button
                            key={item}
                            value={item}
                            onClick={() => setPageNumber(item)}
                            style={{
                                backgroundColor: (item === pageNumber) ? "#bbb" : "#eee"
                            }}
                        >
                            {item}
                        </Button>
                    )
                }
                <PageDropDown />
            </div>
        );
    }

    // Number per page selector sub component.
    const PageDropDown = () => {
        return (
            <Select
                style={{ marginLeft: "10px", backgroundColor: "#eee" }}
                onChange={e => { setNumberPerPage(e.target.value); setPageNumber(1) }}
                value={numberPerPage}
            >
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={20}>20</MenuItem>
                <MenuItem value={30}>30</MenuItem>
            </Select>
        );
    }

    return (
        <div
            style={{
                width: "100%",
                backgroundColor: "#999",
                overflow: "hidden"
            }}
        >
            <Grid container spacing={2} style={{ padding: "10px" }}>
                {
                    bugs.filter(bug => {
                        return bug.report_comment.includes(searchQuery);
                    }).sort((alpha, beta) => {
                        if (dateReportedSortValue !== 0) {
                            let alpha_dt_reported = Date.parse(alpha.dt_reported); 
                            let beta_dt_reported = Date.parse(beta.dt_reported); 
                            
                            if (alpha_dt_reported > beta_dt_reported)
                                return dateReportedSortValue === 2 ? -1 : 1;
                            if (alpha_dt_reported < beta_dt_reported)
                                return dateReportedSortValue === 1 ? -1 : 1;
                            if (alpha_dt_reported === beta_dt_reported)
                                return 0;
                        }
                        if (progressSortValue !== 0) {
                            if (alpha.progress_avg > beta.progress_avg)
                                return progressSortValue === 2 ? -1 : 1;
                            if (alpha.progress_avg < beta.progress_avg)
                                return progressSortValue === 1 ? -1 : 1;
                            if (alpha.progress_avg === beta.progress_avg)
                                return 0;
                        }
                        return 0;
                    }).slice((
                        numberPerPage * (pageNumber - 1)), (numberPerPage * pageNumber
                    )).map((bug, index) => {
                        return <DetailCard key={index} bug={bug} onDelete={onDelete} onRefreshBugs={onRefreshBugs} />
                    })
                }
            </Grid>
            <div className={classes.pageControl}>
                <PageControl />
            </div>
        </div>
    );
}