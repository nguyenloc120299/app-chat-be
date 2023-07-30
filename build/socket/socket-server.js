"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketServer = void 0;
const rooms = {};
const users = [];
let currentRoom = undefined;
const SocketServer = (socket, SocketServer) => {
    socket.on("joinApp", () => {
        users.push({
            socketId: socket.id,
        });
    });
    socket.on("joinRoom", (data) => {
        const userRooms = Object.keys(rooms).filter((roomId) => roomId !== socket.id);
        // Check if the user is not already in the new room, then join the new room
        if (!rooms[data.roomId] || !rooms[data.roomId].includes(data.userId)) {
            // Remove the user from all current rooms
            userRooms.forEach((roomId) => {
                socket.leave(roomId);
                const oldRoomUsers = rooms[roomId];
                if (oldRoomUsers) {
                    // Remove the user from the old room
                    const updatedRoomUsers = oldRoomUsers.filter((user) => user !== data.userId);
                    rooms[roomId] = updatedRoomUsers;
                    SocketServer.to(roomId).emit("userLeft", {
                        data: updatedRoomUsers,
                    });
                }
            });
            socket.join(data.roomId);
            if (!rooms[data.roomId]) {
                rooms[data.roomId] = [];
            }
            rooms[data.roomId].push(data.userId);
            console.log(rooms);
            SocketServer.to(data.roomId).emit("userJoined", {
                data: rooms[data.roomId],
            });
            currentRoom = data.roomId;
        }
    });
    socket.on("sendMessage", (data) => {
        SocketServer.to(data.roomId).emit('messageClient', data);
        users.forEach((user) => {
            SocketServer.to(user.socketId).emit('conservation', data);
        });
    });
    socket.on("joinUser", (user) => {
        console.log("1212121");
    });
    socket.on("leaveRoom", (data) => {
        console.log(data);
        socket.leave(data.roomId);
        if (rooms[data.roomId]) {
            rooms[data.roomId] = rooms[data.roomId].filter((id) => id !== data.userId);
        }
        console.log("User left room", data.roomId, data.userId);
    });
    socket.on("disconnect", () => {
        console.log("User disconnected");
    });
};
exports.SocketServer = SocketServer;
//# sourceMappingURL=socket-server.js.map