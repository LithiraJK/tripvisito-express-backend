import { Server, Socket } from "socket.io";
import { Chat } from "../models/chat.model";

export const initializeSocketService = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    // console.log(`New Connection: ${socket.id}`);

    socket.on("join_chat", (roomId: string) => {
      socket.join(roomId);
      console.log(`User ${socket.id} joined room: ${roomId}`);
    });

    socket.on("send_message", async (data) => {
      try {
        const newChat = await Chat.create({
          roomId: data.room,
          sender: data.senderId,
          message: data.message,
        });

        io.to(data.room).emit("receive_message", {
          ...data,
          _id: newChat._id,
          timeStamp: newChat.timeStamp,
        });
      } catch (error) {
        console.error("Error saving socket message:", error);
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
};