import React, { useContext, useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import PagedView from '../../../components/core/PagedView';
import { backendUrl, getNewToken } from '../../../util/AuthUtil';
import { AuthContext } from '../../../util/AuthContext';
import { deleteBugById } from '../../../util/CommonAPIs';

export default function ReportedByMe() {

    // Get all of the necessary global variables.
    const { accessToken, setAccessToken, refreshToken, username } = useContext(AuthContext);

    // Bug array with progress values.
    const [bugs, setBugs] = useState([]);

    // Get all bug that are reported by the current user with progress values.
    const getBugsReportedByMe = useCallback(() => {
        axios({
            method: 'get',
            url: backendUrl + '/api/get/bug/by-reportee-with-progress',
            params: {reportee: username},
            headers: { authorization: "Bearer " + accessToken }
        }).then((res) => {
            setBugs(res.data);
        }).catch(async (err) => {
            setAccessToken(await getNewToken(refreshToken));
        })

    }, [accessToken, setAccessToken, refreshToken, username]);

    // load the bugs when the page loads.
    useEffect(() => {
        getBugsReportedByMe();
    }, [getBugsReportedByMe])
    
    return (
        <PagedView
            bugs={bugs}
            onRefreshBugs={getBugsReportedByMe}
            onDelete={(bug_id) => {
                deleteBugById(accessToken, setAccessToken, refreshToken, bug_id, () => { getBugsReportedByMe(); });
            }}
        />
    );
}