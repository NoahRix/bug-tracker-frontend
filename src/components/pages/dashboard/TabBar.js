import React from 'react';
import {Tabs, Tab} from '@material-ui/core';

export default function TabBar({onChange, value}){
    
    return(
        <Tabs value={value} onChange={onChange}>
            <Tab label="All Bugs"/>
            <Tab label="Reported By Me"/>
            <Tab label="My Assigned Bugs"/>
        </Tabs>
    );
}