import React, { useState, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Collapse, CardContent, IconButton, TextField, Box, InputAdornment } from '@material-ui/core'
import { Add, Search, EventNote, KeyboardArrowDown, KeyboardArrowUp, Remove, Flag } from '@material-ui/icons'
import TabBar from '../../components/pages/dashboard/TabBar';
import AllBugs from './views/AllBugs';
import ReportedByMe from './views/ReportedByMe';
import MyAssignedBugs from './views/MyAssignedBugs';
import AddNewBugModal from './modals/AddNewBugModal';
import { AuthContext } from '../../util/AuthContext';

const modalStyles = makeStyles((theme) => ({
    bodyStyle: {
        position: "absolute",
        width: "400px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: theme.spacing(2, 4, 3),
        top: "calc(50% - 200px)",
        left: "calc(50% - 200px)"
    },
    fieldRow: {
        display: "flex",
        flexDirection: "row",
    },
    fieldRowItems: {
        margin: "5px",
    }
}));

export default function Dashboard(props) {

    // Get all of the necessary global variables.
    const { searchQuery, setSearchQuery, dateReportedSortValue, setDateReportedSortValue, progressSortValue, setProgressSortValue } = useContext(AuthContext);

    // Tab index for selecting a different dashboard view.
    const [tabIndex, setTabIndex] = useState(0);

    // Flag to show add new bug modal. 
    const [openAddModal, setOpenAddModal] = useState(false);

    // Flag to show search control. 
    const [showSearchControl, setShowSearchControl] = useState(false);

    const handleTabBarChange = (e, v) => {
        setTabIndex(v);
    }

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    }

    const SearchControl = () => {
        return (
            <Box className={modalStyles().fieldRow}>
                <TextField InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <Search />
                        </InputAdornment>
                    ),
                }} value={searchQuery} onChange={handleSearchChange} />
                <div className={modalStyles().fieldRow} >
                    <IconButton style={{ padding: "12px 12px 12px 0px" }} onClick={() => { setDateReportedSortValue((dateReportedSortValue + 1) % 3); setProgressSortValue(0) }}>
                        <EventNote style={{ padding: "0px 0px 0px 12px" }} />
                        {dateReportedSortValue === 0 && <Remove />}
                        {dateReportedSortValue === 1 && <KeyboardArrowUp />}
                        {dateReportedSortValue === 2 && <KeyboardArrowDown />}
                    </IconButton>
                    <IconButton style={{ padding: "12px 12px 12px 0px" }} onClick={() => { setProgressSortValue((progressSortValue + 1) % 3); setDateReportedSortValue(0) }}>
                        <Flag style={{ padding: "0px 0px 0px 12px" }} />
                        {progressSortValue === 0 && <Remove />}
                        {progressSortValue === 1 && <KeyboardArrowUp />}
                        {progressSortValue === 2 && <KeyboardArrowDown />}
                    </IconButton>
                </div>
            </Box>
        );
    }

    return (
        <div>
            <div style={{ display: "flex", flexDirection: "row" }}>
                <TabBar value={tabIndex} onChange={handleTabBarChange} />
                <IconButton onClick={() => setShowSearchControl(!showSearchControl)}>
                    {showSearchControl ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                </IconButton>
                <IconButton onClick={() => setOpenAddModal(true)}><Add /></IconButton>
            </div>
            <Collapse in={showSearchControl} timeout="auto" unmountOnExit>
                <CardContent>
                    {SearchControl()}
                </CardContent>
            </Collapse>
            <AddNewBugModal open={openAddModal} onClose={() => setOpenAddModal(false)} modalStyles={modalStyles()} />
            {tabIndex === 0 && <AllBugs />}
            {tabIndex === 1 && <ReportedByMe />}
            {tabIndex === 2 && <MyAssignedBugs />}
        </div>
    );
}