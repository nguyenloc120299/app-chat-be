import { Socket } from "socket.io";

interface Room {
  [roomId: string]: string[];
}

const rooms: Room = {};

const SocketServer = (socket: Socket, SocketServer: Socket) => {
  socket.on("joinRoom", (data: { roomId: string; userId: string }) => {
    socket.join(data.roomId);

    if (!rooms[data.roomId]) {
      rooms[data.roomId] = [];
    }
    rooms[data.roomId].push(data.userId);
    console.log(rooms);
    SocketServer.to(data.roomId).emit("userJoined", {
      data: rooms[data.roomId],
    });
  });

  socket.on("sendMessage", (roomName, username, message) => {
    socket.to(roomName).emit("message", { username, message });
  });

  socket.on("joinUser", (user) => {
    console.log("1212121");
  });

  socket.on("disconnect", (roomId: string, userId: string) => {
    console.log("User disconnected");

    if (rooms[roomId]) {
      rooms[roomId] = rooms[roomId].filter((id) => id !== userId);
    }
  });
};

export { SocketServer };
