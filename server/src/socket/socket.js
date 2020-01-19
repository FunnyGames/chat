const logger = require('../common/logger')(__filename);
const socketServices = require('../services/socket.service');
const CONSTANTS = require('../common/constants');

module.exports = function (io) {
    io.use(async (socket, next) => {
        let res = await socketServices.addSocketId({
            userId: socket.request._query['userId'],
            socketId: socket.id
        });
        if (res) {
            next();
        }
    });

    socketEvents(io);
}

function socketEvents(io) {
    io.on('connection', (socket) => {
        /* Get the user's Chat list	*/
        socket.on(`chat-list`, async (data) => {
            if (!data.userId) {
                io.emit(`chat-list-response`, {
                    error: true,
                    message: CONSTANTS.USER_NOT_FOUND
                });
            } else {
                const UserInfoResponse = await socketServices.getUserInfo(data.userId);
                const chatlistResponse = await socketServices.getChatList(socket.id);
                if (!UserInfoResponse || !chatlistResponse) {
                    io.to(socket.id).emit(`chat-list-response`, {
                        error: true,
                        chatList: []
                    });
                    return;
                }
                io.to(socket.id).emit(`chat-list-response`, {
                    error: false,
                    chatList: chatlistResponse
                });
                socket.broadcast.emit(`chat-list-new-user`, {
                    error: false,
                    info: UserInfoResponse
                });
            }
        });

        /**
        * send the messages to the user
        */
        socket.on(`add-message`, async (data) => {
            if (!data.message) {
                io.to(socket.id).emit(`add-message-response`, {
                    error: true,
                    message: CONSTANTS.MESSAGE_NOT_FOUND
                });
            } else if (!data.fromUserId) {
                io.to(socket.id).emit(`add-message-response`, {
                    error: true,
                    message: CONSTANTS.SERVER_ERROR_MESSAGE
                });
            } else if (!data.toUserId) {
                io.to(socket.id).emit(`add-message-response`, {
                    error: true,
                    message: CONSTANTS.SELECT_USER
                });
            } else {
                const toSocketId = await socketServices.getSocketId(data.toUserId);
                const messageResult = await socketServices.insertMessages(data);
                if (!toSocketId || !messageResult) {
                    io.to(socket.id).emit(`add-message-response`, {
                        error: true,
                        message: CONSTANTS.MESSAGE_STORE_ERROR
                    });
                    return;
                }
                console.log(toSocketId, data);
                io.to(toSocketId).emit(`add-message-response`, data);
            }
        });

        /**
        * Logout the user
        */
        socket.on('logout', async (data) => {
            const userId = data.userId;
            let res = await socketServices.logout(userId);
            if (!res) {
                io.to(socket.id).emit(`logout-response`, {
                    error: true,
                    message: CONSTANTS.SERVER_ERROR_MESSAGE,
                    userId: userId
                });
                return;
            }

            io.to(socket.id).emit(`logout-response`, {
                error: false,
                message: CONSTANTS.USER_LOGGED_OUT,
                userId: userId
            });
            socket.broadcast.emit(`chat-list-user-logout`, {
                error: false,
                userId: userId
            });
        });

        /**
        * sending the disconnected user to all socket users. 
        */
        socket.on('disconnect', async () => {
            let userId = socket.request._query['userId'];
            await socketServices.logout(userId);
            socket.broadcast.emit(`chat-list-user-logout`, {
                error: false,
                userId: userId
            });
        });
    });
}