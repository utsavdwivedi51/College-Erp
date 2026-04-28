import Fee from "../models/fee.js";
import Student from "../models/student.js";

const computeStatus = (paidAmount, totalAmount) => {
    if (paidAmount >= totalAmount && totalAmount > 0) return "Paid";
    if (paidAmount > 0) return "Partial";
    return "Unpaid";
};

export const assignFeeToStudent = async (req, res) => {
    try {
        const {
            studentId,
            feeType,
            academicYear,
            semester,
            totalAmount,
            dueDate,
        } = req.body;

        if (!studentId || !feeType || totalAmount === undefined) {
            return res
                .status(400)
                .json({ message: "studentId, feeType and totalAmount are required" });
        }

        const fee = await Fee.create({
            student: studentId,
            feeType,
            academicYear,
            semester,
            totalAmount,
            dueDate: dueDate ? new Date(dueDate) : undefined,
            assignedBy: req.userId,
            status: computeStatus(0, Number(totalAmount)),
        });

        const populated = await fee.populate("student");

        res.status(201).json({ success: true, result: populated });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const assignFeeToBatch = async (req, res) => {
    try {
        const {
            department,
            year,
            section,
            feeType,
            academicYear,
            semester,
            totalAmount,
            dueDate,
        } = req.body;

        if (!department || !year || !feeType || totalAmount === undefined) {
            return res
                .status(400)
                .json({ message: "department, year, feeType and totalAmount are required" });
        }

        const studentQuery = {
            department,
            year,
        };
        if (section) studentQuery.section = section;

        const students = await Student.find(studentQuery).select("_id");

        if (!students.length) {
            return res
                .status(404)
                .json({ message: "No students found for the selected class" });
        }

        const payload = students.map((student) => ({
            student: student._id,
            feeType,
            academicYear,
            semester,
            totalAmount,
            dueDate: dueDate ? new Date(dueDate) : undefined,
            assignedBy: req.userId,
            status: computeStatus(0, Number(totalAmount)),
        }));

        const created = await Fee.insertMany(payload);

        res.status(201).json({
            success: true,
            result: {
                assignedCount: created.length,
            },
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAdminFees = async (req, res) => {
    try {
        const { department, year, section, status, search } = req.query;

        let studentIds = null;
        if (department || year || section || search) {
            const studentQuery = {};
            if (department) studentQuery.department = department;
            if (year) studentQuery.year = Number(year) || year;
            if (section) studentQuery.section = section;
            if (search) {
                studentQuery.$or = [
                    { name: { $regex: search, $options: "i" } },
                    { username: { $regex: search, $options: "i" } },
                    { email: { $regex: search, $options: "i" } },
                ];
            }
            const students = await Student.find(studentQuery).select("_id");
            studentIds = students.map((s) => s._id);
        }

        const feeQuery = {};
        if (status) feeQuery.status = status;
        if (studentIds) feeQuery.student = { $in: studentIds };

        const fees = await Fee.find(feeQuery)
            .populate("student")
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, result: fees });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getFeeReportByClass = async (req, res) => {
    try {
        const { department, year, section } = req.query;

        if (!department || !year) {
            return res
                .status(400)
                .json({ message: "department and year are required" });
        }

        const studentQuery = { department, year: Number(year) || year };
        if (section) studentQuery.section = section;

        const students = await Student.find(studentQuery);

        const studentIds = students.map((s) => s._id);
        const fees = await Fee.find({ student: { $in: studentIds } }).populate(
            "student"
        );

        const totals = fees.reduce(
            (acc, fee) => {
                acc.totalAssigned += fee.totalAmount;
                acc.totalPaid += fee.paidAmount;
                acc.totalDue += Math.max(fee.totalAmount - fee.paidAmount, 0);
                return acc;
            },
            { totalAssigned: 0, totalPaid: 0, totalDue: 0 }
        );

        const studentBreakdown = students.map((student) => {
            const studentFees = fees.filter(
                (fee) => fee.student._id.toString() === student._id.toString()
            );
            const summary = studentFees.reduce(
                (acc, fee) => {
                    acc.totalAmount += fee.totalAmount;
                    acc.paidAmount += fee.paidAmount;
                    return acc;
                },
                { totalAmount: 0, paidAmount: 0 }
            );
            return {
                id: student._id,
                name: student.name,
                rollNo: student.username || student.email,
                totalAmount: summary.totalAmount,
                paidAmount: summary.paidAmount,
                dueAmount: Math.max(summary.totalAmount - summary.paidAmount, 0),
            };
        });

        res.status(200).json({
            success: true,
            result: {
                totals,
                students: studentBreakdown,
                totalStudents: students.length,
            },
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getStudentFees = async (req, res) => {
    try {
        const studentId = req.userId;
        const fees = await Fee.find({ student: studentId }).sort({ createdAt: -1 });

        const totals = fees.reduce(
            (acc, fee) => {
                acc.totalAmount += fee.totalAmount;
                acc.paidAmount += fee.paidAmount;
                acc.totalDue += Math.max(fee.totalAmount - fee.paidAmount, 0);
                acc.pendingCount += fee.status !== "Paid" ? 1 : 0;
                return acc;
            },
            { totalAmount: 0, paidAmount: 0, totalDue: 0, pendingCount: 0 }
        );

        res.status(200).json({ success: true, result: { fees, totals } });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const payStudentFee = async (req, res) => {
    try {
        const studentId = req.userId;
        const { feeId, amount, method, note } = req.body;

        if (!feeId || !amount) {
            return res.status(400).json({ message: "feeId and amount are required" });
        }

        const fee = await Fee.findById(feeId);
        if (!fee) return res.status(404).json({ message: "Fee not found" });

        if (fee.student.toString() !== studentId.toString()) {
            return res.status(403).json({ message: "Not authorized to pay this fee" });
        }

        const paymentAmount = Number(amount);
        fee.paidAmount = Math.min(fee.paidAmount + paymentAmount, fee.totalAmount);
        fee.status = computeStatus(fee.paidAmount, fee.totalAmount);
        fee.payments.push({ amount: paymentAmount, method, note });

        const updated = await fee.save();

        res.status(200).json({ success: true, result: updated });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
