import { Server, Socket } from "socket.io";
import mongoose from "mongoose";
import { Chat } from "../models/chat.model";

export const initializeSocketService = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    socket.on("join_chat", (roomId: string) => {
      if (!roomId || typeof roomId !== "string") return;
      socket.join(roomId);
    });

    socket.on("send_message", async (data) => {
      try {
        if (!data || !data.room || typeof data.message !== "string") {
          return;
        }

        const trimmedMessage = data.message.trim();
        if (!trimmedMessage || trimmedMessage.length > 2000) {
          return;
        }

        if (!data.senderId || !mongoose.isValidObjectId(data.senderId)) {
          return;
        }

        const newChat = await Chat.create({
          roomId: String(data.room),
          sender: data.senderId,
          message: trimmedMessage,
        });

        io.to(data.room).emit("receive_message", {
          room: data.room,
          senderId: data.senderId,
          message: trimmedMessage,
          sender: data.sender,
          _id: newChat._id,
          timeStamp: newChat.timeStamp,
        });
      } catch (error) {
        console.error("Error saving socket message:", error);
      }
    });

    socket.on("disconnect", () => {
      // User disconnected
    });
  });
};
