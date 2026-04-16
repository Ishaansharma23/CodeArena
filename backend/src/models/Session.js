import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    problem: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      required: true,
    },
    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    participants: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
      default: [],
    },
    maxParticipants: {
      type: Number,
      min: 2,
      max: 4,
      default: 2,
    },
    status: {
      type: String,
      enum: ["active", "completed"],
      default: "active",
    },
    // stream video call ID
    callId: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const Session = mongoose.model("Session", sessionSchema);

export default Session;
