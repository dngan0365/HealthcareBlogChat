import Chat from "../models/chat.model.js";
import UserChats from "../models/userChats.model.js";
import path from "path";

// [POST] create a new chat
export const createNewChat = async (req, res) => {
  const userId = req.auth?.userId;
  const { text } = req.body;

  if (!userId) {
    return res.status(400).send("User authentication is required.");
  }

  if (!text) {
    return res.status(400).send("Chat content is required.");
  }

  try {
    // Create a new chat
    const newChat = new Chat({
      user: userId,
      history: [{ role: "user", parts: [{ text }] }],
    });

    const savedChat = await newChat.save();

    // Check if the user's chat record exists
    const userChats = await UserChats.findOne({ user: userId });

    if (!userChats) {
      // If it doesn't exist, create a new record and add the chat
      const newUserChats = new UserChats({
        user: userId,
        chats: [
          {
            _id: savedChat._id,
            title: text.substring(0, 40),
          },
        ],
      });

      await newUserChats.save();
    } else {
      // If it exists, add the new chat to the chats array
      await UserChats.updateOne(
        { user: userId },
        {
          $push: {
            chats: {
              _id: savedChat._id,
              title: text.substring(0, 40),
            },
          },
        }
      );
    }

    // Send the response with the chat ID
    res.status(201).json({ chatId: savedChat._id });
  } catch (err) {
    console.error("Error creating chat:", err);
    res.status(500).send("Error creating chat!");
  }
};

// [GET] get chat page
export const getChatPage = async (req, res) =>{
  const ClerkUserId = req.auth.userId;

    try {
      const userChats = await UserChats.find({user: ClerkUserId });
      console.log(userChats)
      if (!userChats || userChats.length === 0) {
        return res.status(200).json({ message: "There are no chats" }); 
      }
      res.status(200).send(userChats[0].chats);
    } catch (error) {
      console.error("Error fetching user chats:", error);
      res.status(500).send("An error occurred while fetching user chats.");
    }
}
// [GET] get chat item
export const getChatItem = async (req, res ) =>{
    const userId = req.auth.userId;
    console.log(userId)
    console.log(req.params.chatId)
    try {
      const chat = await Chat.findOne({ _id: req.params.chatId, user: userId });
      console.log(chat)
      res.status(200).send(chat);
    } catch (err) {
      console.log(err);
      res.status(500).send("Error fetching chat!");
    }
}
// [PUT] Put a question
export const putQuestion = async (req, res) =>{
    const userId = req.auth.userId;
    console.log(req.body)
    const { question, answer, img } = req.body;
  
    const newItems = [
      ...(question
        ? [{ role: "user", parts: [{ text: question }], ...(img && { img }) }]
        : []),
      { role: "model", parts: [{ text: answer }] },
    ];
  
    try {
      const updatedChat = await Chat.updateOne(
        { _id: req.params.chatId, user: userId },
        {
          $push: {
            history: {
              $each: newItems,
            },
          },
        }
      );
      res.status(200).send(updatedChat);
    } catch (err) {
      console.log(err);
      res.status(500).send("Error adding conversation!");
    }
}
