import User from "../models/user.model.js"

export const getUser = async (req, res) => {
    const userId = req.auth.userId;
    try {
        const userInfo = await User.find({clerkUserId: userId });
        console.log(userInfo)
        if (!userInfo || userInfo .length === 0) {
          return res.status(200).json({ message: "The user is not in database" }); 
        }
        res.status(200).send(userInfo);
      } catch (error) {
        console.error("Error fetching user chats:", error);
        res.status(500).send("An error occurred while fetching user chats.");
      }

}

export const editUser = async (req, res) => {
    const userId = req.auth.userId;
  
    const { firstName, lastName, age, gender, weight, height } = req.body;
  
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }
  
    try {
      // Build an object with only the fields that exist in req.body
      const updateData = {};
      if (firstName !== undefined) updateData.firstname = firstName;
      if (lastName !== undefined) updateData.lastname = lastName;
      if (age !== undefined) updateData.age = Number(age);
      if (gender !== undefined) updateData.gender = gender;
      if (weight !== undefined) updateData.weight = Number(weight);
      if (height !== undefined) updateData.height = Number(height);
  
      const updatedUser = await User.findOneAndUpdate(
        { clerkUserId: userId }, // Query to find user by clerkUserId
        { $set: updateData }, // Update fields
        { new: true, upsert: true } // Return the updated document, create if not exists
      );
  
      res.status(200).json({ message: "Profile updated successfully", user: updatedUser });
    } catch (error) {
      console.error("Error updating user profile:", error);
      res.status(500).json({ error: "An error occurred while updating the profile" });
    }
  };