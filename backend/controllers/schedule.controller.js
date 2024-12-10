import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import Schedule from "../models/schedule.model.js"

// controllers/zooEvent.controller.js
export const getAllEvents = async (req, res) => {
    const userId = req.auth?.userId;
    console.log("get userId ", userId)

    if (!userId) {
        return res.status(400).json({ message: "userId is required" });
    }

    try {
        const events = await Schedule.find({ user: userId });
        console.log(events)
        res.status(200).json({ count: events.length, result: events });
    } catch (error) {
        console.error("Error fetching zoo events:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const batchUpdateEvents = async (req, res) => {
    console.log("batch schedule ", req.body);
    const { added, changed, deleted, userId } = req.body;

    if (!userId) {
        return res.status(400).json({ message: "userId is required" });
    }

    try {
        // Add new events
        if (added && added.length > 0) {
            const eventsToAdd = added.map(event => ({ ...event, user: userId }));
            await Schedule.insertMany(eventsToAdd);
            console.log(`New events inserted for userId: ${userId}`);
        }

        // Update existing events
        if (changed && changed.length > 0) {
            for (const event of changed) {
                await Schedule.updateOne({ user: userId, Id: event.Id }, { ...event, userId });
                console.log(`event updated for Id: ${event.Id}`);
            }
        }

        // Delete events
        if (deleted && deleted.length > 0) {
            const eventIds = deleted.map(event => event.Id);
            await Schedule.deleteMany({ user: userId, Id: { $in: eventIds } });
            console.log(`events deleted for Ids: ${eventIds}`);
        }

        res.status(200).json(req.body);
    } catch (error) {
        console.error("Error processing batch update:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
