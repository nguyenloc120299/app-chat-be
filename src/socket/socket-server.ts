import { Socket } from "socket.io";
const SocketServer = (socket: Socket) => {
  socket.on("joinUser", (user) => {
    console.log("1212121");
  });
};
export { SocketServer };
