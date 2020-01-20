import * as axios from 'axios';

axios.defaults.withCredentials = true;

class ChatHttpServer {

    getUser() {
        return new Promise((resolve, reject) => {
            try {
                let userId = localStorage.getItem('userid');
                let username = localStorage.getItem('username');
                resolve({ userId, username });
            } catch (error) {
                reject(error);
            }
        });
    }

    removeLS() {
        return new Promise((resolve, reject) => {
            try {
                localStorage.removeItem('userid');
                localStorage.removeItem('username');
                resolve(true);
            } catch (error) {
                reject(error);
            }
        });
    }

    setLS(key, value) {
        return new Promise((resolve, reject) => {
            try {
                localStorage.setItem(key, value);
                resolve(true);
            } catch (error) {
                reject(error);
            }
        });
    }

    login(userCredential) {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await axios.post('http://localhost:5000/users/login', userCredential);
                resolve(response.data);
            } catch (error) {
                reject(error);
            }
        });
    }

    checkUsernameAvailability(username) {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await axios.post('http://localhost:5000/available', {
                    username: username
                });
                resolve(response.data);
            } catch (error) {
                reject(error);
            }
        });
    }

    register(userCredential) {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await axios.post('http://localhost:5000/users/register', userCredential);
                resolve(response.data);
            } catch (error) {
                reject(error);
            }
        });
    }

    userSessionCheck() {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await axios.get('http://localhost:5000/users/check');
                resolve(response.data);
            } catch (error) {
                reject(error);
            }
        });
    }

    getMessages(userId, toUserId) {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await axios.post('http://localhost:5000/messages/get', {
                    userId: userId,
                    toUserId: toUserId
                });
                //console.log(response);
                resolve(response.data);
            } catch (error) {
                reject(error);
            }
        });
    }

    getKeys() {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await axios.get('http://localhost:5000/users/keys');
                resolve(response.data);
            } catch (error) {
                reject(error);
            }
        });
    }

    getKey(otherUserId) {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await axios.post('http://localhost:5000/users/key', { userId: otherUserId });
                console.log(response);
                resolve(response.data);
            } catch (error) {
                reject(error);
            }
        });
    }

}

export default new ChatHttpServer();