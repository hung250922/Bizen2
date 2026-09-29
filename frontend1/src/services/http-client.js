import axios from 'axios';

const httpClient = axios.create({
    baseURL: process.env.REACT_APP_API_ENDPOINT_URL,
    headers: {
        "Content-Type": "application/json"
    },
    auth: {
        username: process.env.REACT_APP_BASIC_AUTH_USERNAME,
        password: process.env.REACT_APP_BASIC_AUTH_PASSWORD
    }
});

export default httpClient;