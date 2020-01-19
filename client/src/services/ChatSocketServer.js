import * as io from 'socket.io-client';
const events = require('events');


class ChatSocketServer {

    socket = null
    eventEmitter = new events.EventEmitter();

    // Connecting to Socket Server
    establishSocketConnection(userId) {
        try {
            this.socket = io(`http://localhost:5000`, {
                query: `userId=${userId}`
            });
        } catch (error) {
            alert(`Something went wrong; Can't connect to socket server`);
        }
    }

    getChatList(userId) {
        this.socket.emit('chat-list', {
            userId: userId
        });
        this.socket.on('chat-list-response', (data) => {
            console.log('chat-list-response', data);
            this.eventEmitter.emit('chat-list-response', data);
        });
        this.socket.on('chat-list-new-user', (data) => {
            console.log('chat-list-new-user', data);
            this.eventEmitter.emit('chat-list-new-user', data);
        });
        this.socket.on('chat-list-user-logout', (data) => {
            console.log('chat-list-user-logout', data);
            this.eventEmitter.emit('chat-list-user-logout', data);
        });
        this.socket.on('add-message-response', (data) => {
            console.log('add-message-response', data);
            this.eventEmitter.emit('add-message-response', data);
        });
    }

    sendMessage(message) {
        this.socket.emit('add-message', message);
    }

    logout(userId) {
        this.socket.emit('logout', userId);
        this.socket.on('logout-response', (data) => {
            this.eventEmitter.emit('logout-response', data);
        });
    }

}

export default new ChatSocketServer()