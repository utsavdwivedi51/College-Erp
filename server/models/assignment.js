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

const assignmentSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        subject: {
            type: String,
            required: true,
            trim: true,
        },
        department: {
            type: String,
            required: true,
            trim: true,
        },
        year: {
            type: Number,
            required: true,
        },
        section: {
            type: String,
            required: true,
            trim: true,
        },
        deadline: {
            type: Date,
            required: true,
        },
        maxMarks: {
            type: Number,
            default: 100,
        },
        description: {
            type: String,
            default: "",
            trim: true,
        },
        attachments: [attachmentSchema],
        totalStudents: {
            type: Number,
            default: 0,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "faculty",
            required: true,
        },
        createdByName: {
            type: String,
            default: "",
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("assignment", assignmentSchema);
