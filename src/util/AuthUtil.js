import axios from 'axios';

const dotenv = require('dotenv');
dotenv.config();

export const getNewToken = async (refreshToken) => {

    let accessToken = null;

    const query = new Promise((resolve, reject) => {
        axios({
            method: 'post',
            url: 'http://localhost:3001/api/post/auth/token',
            data: { token: refreshToken }
        }).then(res => {
            //console.log(res.data);
            accessToken = res.data.accessToken;
            resolve();
        }).catch((err) => {
            //console.log(err);
            reject();
        })
    })

    await query;
    //console.log(accessToken);    
    return accessToken;
}

export const backendUrl =`https://${process.env.REACT_APP_BACKEND_HOST}:${process.env.REACT_APP_BACKEND_PORT}`;
