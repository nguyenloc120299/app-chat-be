import { Socket } from "socket.io";

interface Room {
  [roomId: string]: string[];
}
export interface Sender {
  name: string,
  _id: string
}
export interface Leave_Room {
  roomId: string,
  userId: string
}

export interface MESSAGE {
  content: string;
  sender: Sender;
  createdAt: any;
  roomId: string;
  file?: string;
  typeFile?: string;
}

const rooms: Room = {};
const users = [] as any
let currentRoom: string | undefined = undefined;
const SocketServer = (socket: Socket, SocketServer: Socket) => {
  socket.on("joinApp", () => {
    users.push({
      socketId: socket.id,
    });
  })

  socket.on("joinRoom", (data: { roomId: string; userId: string }) => {
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



  socket.on("sendMessage", (data: MESSAGE) => {
    SocketServer.to(data.roomId).emit('messageClient', data)
    users.forEach((user: any) => {
      SocketServer.to(user.socketId).emit('conservation', data);
    });
  });

  socket.on("joinUser", (user) => {
    console.log("1212121");
  });

  socket.on('removeRoom', (data: { roomId: string }) => {
    users.forEach((user: any) => {
      SocketServer.to(user.socketId).emit('removeRoomClient', data);
    });
  })

   socket.on("addRoom", (data:any) => {
     users.forEach((user: any) => {
       SocketServer.to(user.socketId).emit("addRoomClient", data);
     });
   });

  socket.on("leaveRoom", (data: Leave_Room) => {
    console.log(data);

    socket.leave(data.roomId);

    if (rooms[data.roomId]) {
      rooms[data.roomId] = rooms[data.roomId].filter((id) => id !== data.userId);
    }

    console.log("User left room", data.roomId, data.userId);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected")
  });
};

export { SocketServer }; 
