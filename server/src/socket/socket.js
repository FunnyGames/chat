const logger = require('../common/logger')(__filename);
const socketServices = require('../services/socket.service');
const CONSTANTS = require('../common/constants');

module.exports = function (io) {
    io.use(async (socket, next) => {
        try {
            await socketServices.addSocketId({
                userId: socket.request._query['userId'],
                socketId: socket.id
            });
            next();
        } catch (error) {
            logger.error(error);
        }
    });

    socketEvents(io);
}

function socketEvents(io) {
    io.on('connection', (socket) => {
        /* Get the user's Chat list	*/
        socket.on(`chat-list`, async (data) => {
            if (!data.userId) {
                this.io.emit(`chat-list-response`, {
                    error: true,
                    message: CONSTANTS.USER_NOT_FOUND
                });
            } else {
                try {
                    const [UserInfoResponse, chatlistResponse] = await Promise.all([
                        socketServices.getUserInfo(data.userId),
                        socketServices.getChatList(socket.id)
                    ]);
                    this.io.to(socket.id).emit(`chat-list-response`, {
                        error: false,
                        singleUser: false,
                        chatList: chatlistResponse
                    });
                    socket.broadcast.emit(`chat-list-response`, {
                        error: false,
                        singleUser: true,
                        chatList: UserInfoResponse
                    });
                } catch (error) {
                    logger.error(error);
                    this.io.to(socket.id).emit(`chat-list-response`, {
                        error: true,
                        chatList: []
                    });
                }
            }
        });

        /**
        * send the messages to the user
        */
        socket.on(`add-message`, async (data) => {
            if (!data.message) {
                this.io.to(socket.id).emit(`add-message-response`, {
                    error: true,
                    message: CONSTANTS.MESSAGE_NOT_FOUND
                });
            } else if (!data.fromUserId) {
                this.io.to(socket.id).emit(`add-message-response`, {
                    error: true,
                    message: CONSTANTS.SERVER_ERROR_MESSAGE
                });
            } else if (!data.toUserId) {
                this.io.to(socket.id).emit(`add-message-response`, {
                    error: true,
                    message: CONSTANTS.SELECT_USER
                });
            } else {
                try {
                    const [toSocketId, messageResult] = await Promise.all([
                        socketServices.getSocketId(data.toUserId),
                        socketServices.insertMessages(data)
                    ]);
                    this.io.to(toSocketId).emit(`add-message-response`, data);
                } catch (error) {
                    logger.error(error);
                    this.io.to(socket.id).emit(`add-message-response`, {
                        error: true,
                        message: CONSTANTS.MESSAGE_STORE_ERROR
                    });
                }
            }
        });

        /**
        * Logout the user
        */
        socket.on('logout', async (data) => {
            const userId = data.userId;
            try {
                await socketServices.logout(userId);
                this.io.to(socket.id).emit(`logout-response`, {
                    error: false,
                    message: CONSTANTS.USER_LOGGED_OUT,
                    userId: userId
                });

                socket.broadcast.emit(`chat-list-response`, {
                    error: false,
                    userDisconnected: true,
                    userId: userId
                });
            } catch (error) {
                logger.error(error);
                this.io.to(socket.id).emit(`logout-response`, {
                    error: true,
                    message: CONSTANTS.SERVER_ERROR_MESSAGE,
                    userId: userId
                });
            }
        });

        /**
        * sending the disconnected user to all socket users. 
        */
        socket.on('disconnect', async () => {
            socket.broadcast.emit(`chat-list-response`, {
                error: false,
                userDisconnected: true,
                userId: socket.request._query['userId']
            });
        });
    });
}