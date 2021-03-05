import axios from 'axios';
import {getNewToken} from './AuthUtil'
import { backendUrl } from '../util/AuthUtil';

// API request to all usernames.
export const getAllUsernames = (accessToken, setAccessToken, refreshToken, result) => {
    axios({
        method: 'get',
        url: backendUrl + '/api/get/user/all-usernames',
        headers: { authorization: "Bearer " + accessToken }
    }).then((res) => {
        result(res.data);
    }).catch(async (err) => {
        setAccessToken(await getNewToken(refreshToken));
    })
};

export const deleteBugById = (accessToken, setAccessToken, refreshToken, bug_id, result) => {
    axios({
        method: 'post',
        url: backendUrl + '/api/post/bug/delete',
        data: {bug_id: bug_id},
        headers: { authorization: "Bearer " + accessToken }
    }).then((res) => {
        result();
    }).catch(async () => {
        setAccessToken(await getNewToken(refreshToken));
    })
};
