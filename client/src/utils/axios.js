import axios from 'axios';

axios.defaults.withCredentials = true;
const host = 'http://3.122.233.242' || 'http://localhost';
const port = '5000';

const instance = axios.create({
    baseURL: host + ':' + port
});

export default instance;