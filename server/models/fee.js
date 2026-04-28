import mongoose from "mongoose";
const { Schema } = mongoose;

const feePaymentSchema = new Schema(
    {
        amount: {
            type: Number,
            required: true,
        },
        method: {
            type: String,
            default: "Manual",
        },
        note: {
            type: String,
        },
        paidAt: {
            type: Date,
            default: Date.now,
        },
    },
    { _id: false }
);

const feeSchema = new Schema(
    {
        student: {
            type: Schema.Types.ObjectId,
            ref: "student",
            required: true,
        },
        feeType: {
            type: String,
            required: true,
            trim: true,
        },
        academicYear: {
            type: String,
        },
        semester: {
            type: String,
        },
        totalAmount: {
            type: Number,
            required: true,
            min: 0,
        },
        paidAmount: {
            type: Number,
            default: 0,
            min: 0,
        },
        dueDate: {
            type: Date,
        },
        status: {
            type: String,
            enum: ["Unpaid", "Partial", "Paid"],
            default: "Unpaid",
        },
        assignedBy: {
            type: Schema.Types.ObjectId,
            ref: "admin",
        },
        payments: [feePaymentSchema],
    },
    { timestamps: true }
);

export default mongoose.model("fee", feeSchema);
