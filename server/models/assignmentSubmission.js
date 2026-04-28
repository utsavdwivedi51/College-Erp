import mongoose from "mongoose";

const attachmentSchema = new mongoose.Schema(
    {
        name: String,
        type: String,
        size: Number,
        content: String,
    },
    { _id: false }
);

const assignmentSubmissionSchema = new mongoose.Schema(
    {
        assignment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "assignment",
            required: true,
        },
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "student",
            required: true,
        },
        studentName: {
            type: String,
            default: "",
        },
        studentUsername: {
            type: String,
            default: "",
        },
        notes: {
            type: String,
            default: "",
        },
        attachments: [attachmentSchema],
        submittedAt: {
            type: Date,
            default: Date.now,
        },
        isLate: {
            type: Boolean,
            default: false,
        },
        marksAwarded: {
            type: Number,
        },
        feedback: {
            type: String,
            default: "",
        },
    },
    { timestamps: true }
);

assignmentSubmissionSchema.index({ assignment: 1, student: 1 }, { unique: true });

export default mongoose.model("assignmentSubmission", assignmentSubmissionSchema);
