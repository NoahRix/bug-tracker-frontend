import React, { useContext, useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import PagedView from '../../../components/core/PagedView';
import { backendUrl, getNewToken } from '../../../util/AuthUtil';
import { AuthContext } from '../../../util/AuthContext';
import { deleteBugById } from '../../../util/CommonAPIs';

export default function AllBugs() {

    // Get the necessary global variables
    const { accessToken, setAccessToken, refreshToken } = useContext(AuthContext);

    // Bug objects array (with progress values).
    const [bugs, setBugs] = useState([]);

    // API request to get all of the bugs with progress.
    const getAllBugs = useCallback(() => {
        axios({
            method: 'get',
            url: backendUrl + '/api/get/bug/all-with-progress',
            headers: { authorization: "Bearer " + accessToken }
        }).then((res) => {
            setBugs(res.data);
        }).catch(async (err) => {
            setAccessToken(await getNewToken(refreshToken));
        })
    }, [accessToken, setAccessToken, refreshToken]);

    // Get all of the bugs when the page loads.
    useEffect(() => {
        getAllBugs();
    }, [getAllBugs])

    return (
        <PagedView
            bugs={bugs}
            onRefreshBugs={getAllBugs}
            onDelete={(bug_id) => {
                deleteBugById(accessToken, setAccessToken, refreshToken, bug_id, () => { getAllBugs(); });
            }}
        />
    );
}