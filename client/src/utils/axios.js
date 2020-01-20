import axios from 'axios';

axios.defaults.withCredentials = true;
const host = process.env.SERVER_HOST || 'http://localhost';
const port = process.env.SERVER_PORT || '5000';

const instance = axios.create({
    baseURL: host + ':' + port
});

export default instance;