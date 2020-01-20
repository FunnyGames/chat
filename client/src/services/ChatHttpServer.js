import axios from '../utils/axios';
import Keys from '../utils/Keys';

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

    getLSKeys() {
        return new Promise((resolve, reject) => {
            try {
                let pubExp = localStorage.getItem('publicExp');
                let pubKey = localStorage.getItem('publicKey');
                let priKey = localStorage.getItem('privateKey');
                resolve({ pubExp, pubKey, priKey });
            } catch (error) {
                reject(error);
            }
        });
    }

    setLSKeys(keys) {
        return new Promise((resolve, reject) => {
            try {
                localStorage.setItem('publicExp', keys.pubExp);
                localStorage.setItem('publicKey', keys.pubKey);
                localStorage.setItem('privateKey', keys.priKey);
                resolve(true);
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
                const response = await axios.post('/users/login', userCredential);
                resolve(response.data);
            } catch (error) {
                reject(error);
            }
        });
    }

    checkUsernameAvailability(username) {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await axios.post('/available', {
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
                const response = await axios.post('/users/register', userCredential);
                resolve(response.data);
            } catch (error) {
                reject(error);
            }
        });
    }

    userSessionCheck() {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await axios.get('/users/check');
                resolve(response.data);
            } catch (error) {
                reject(error);
            }
        });
    }

    getMessages(userId, toUserId) {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await axios.post('/messages/get', {
                    userId: userId,
                    toUserId: toUserId
                });
                resolve(response.data);
            } catch (error) {
                reject(error);
            }
        });
    }

    getKeys() {
        return new Promise(async (resolve, reject) => {
            try {
                let keys = await Keys.getKeys();
                const response = await axios.get('/users/keys', {
                    headers: {
                        exp: keys.pubExp,
                        key: keys.pubKey
                    }
                });
                let data = Keys.decrypt(response.data.msg, keys.priKey, keys.pubKey);

                resolve(data);
            } catch (error) {
                reject(error);
            }
        });
    }

    getKey(otherUserId) {
        return new Promise(async (resolve, reject) => {
            try {
                let keys = await Keys.getKeys();
                const response = await axios.post('/users/key', { userId: otherUserId }, {
                    headers: {
                        exp: keys.pubExp,
                        key: keys.pubKey
                    }
                });
                let data = Keys.decrypt(response.data.msg, keys.priKey, keys.pubKey);

                resolve(data);
            } catch (error) {
                reject(error);
            }
        });
    }

}

export default new ChatHttpServer();