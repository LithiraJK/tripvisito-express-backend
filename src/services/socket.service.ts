import { Server, Socket } from "socket.io";
import { Chat } from "../models/chat.model";

export const initializeSocketService = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    console.log(`New Connection: ${socket.id}`);

    // Room එකකට සම්බන්ධ වීම (User ID එක room ID එක ලෙස භාවිතා කළ හැක)
    socket.on("join_chat", (roomId: string) => {
      socket.join(roomId);
      console.log(`User ${socket.id} joined room: ${roomId}`);
    });

    // පණිවිඩයක් ලැබුණු විට එය Database එකේ සුරැකීම සහ Emit කිරීම
    socket.on("send_message", async (data) => {
      try {
        // 1. Database එකේ සුරැකීම
        const newChat = await Chat.create({
          roomId: data.room,
          sender: data.senderId,
          message: data.message,
        });

        // 2. අදාළ සියලු දෙනාට පණිවිඩය යැවීම
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