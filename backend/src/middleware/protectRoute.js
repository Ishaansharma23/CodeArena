import { clerkClient, getAuth } from "@clerk/express";
import User from "../models/User.js";
import { upsertStreamUser } from "../lib/stream.js";

export const protectRoute = async (req, res, next) => {
  try {
    const { userId } = getAuth(req);

    if (!userId) return res.status(401).json({ message: "Unauthorized - invalid token" });

    // find user in db by clerk ID
    let user = await User.findOne({ clerkId: userId });

    if (!user) {
      // Fallback: create the user on first request if Inngest sync isn't configured.
      const clerkUser = await clerkClient.users.getUser(userId);
      const email = clerkUser.emailAddresses?.[0]?.emailAddress;
      const name = `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim();

      if (!email) {
        return res.status(400).json({ message: "User email is required" });
      }

      user = await User.create({
        clerkId: userId,
        email,
        name: name || email,
        profileImage: clerkUser.imageUrl || "",
      });

      await upsertStreamUser({
        id: user.clerkId,
        name: user.name,
        image: user.profileImage,
      });
    }

    // attach user to req
    req.user = user;

    next();
  } catch (error) {
    console.error("Error in protectRoute middleware", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
