const mongoose = require("mongoose");

const chatModel = mongoose.Schema(
    {
        chatName: {
            type: String, 
            trim: true,
        },
        isGroupChat: {
            type: String, 
            trim: true,
        },
        users: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            }
        ],
        latestMessage: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Message",
        },
        groupAdmin: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            
        }
    },
    {
        timesStamps: true
    }
);


const Chat = mongoose.model("Chat", chatModel);

module.exports = Chat;