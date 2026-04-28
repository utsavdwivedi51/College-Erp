import Faculty from "../models/faculty.js";
import Test from "../models/test.js";
import Student from "../models/student.js";
import Subject from "../models/subject.js";
import Marks from "../models/marks.js";
import Attendence from "../models/attendance.js";
import Assignment from "../models/assignment.js";
import AssignmentSubmission from "../models/assignmentSubmission.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const sanitizeAttachments = (attachments = []) => {
  if (!Array.isArray(attachments)) return [];
  return attachments
    .map((file) => ({
      name: file?.name || "file",
      type: file?.type || "application/octet-stream",
      size: Number(file?.size) || 0,
      content: file?.content || "",
    }))
    .filter((file) => file.content);
};

export const facultyLogin = async (req, res) => {
  const { username, password } = req.body;
  const errors = { usernameError: String, passwordError: String };
  try {
    const existingFaculty = await Faculty.findOne({ username });
    if (!existingFaculty) {
      errors.usernameError = "Faculty doesn't exist.";
      return res.status(404).json(errors);
    }
    if (existingFaculty.isActive === false) {
      errors.passwordError = "Account is inactive. Please contact admin.";
      return res.status(403).json(errors);
    }
    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingFaculty.password
    );
    if (!isPasswordCorrect) {
      errors.passwordError = "Invalid Credentials";
      return res.status(404).json(errors);
    }

    const token = jwt.sign(
      {
        email: existingFaculty.email,
        id: existingFaculty._id,
      },
      "sEcReT",
      { expiresIn: "1h" }
    );

    res.status(200).json({ result: existingFaculty, token: token });
  } catch (error) {
    console.log(error);
  }
};

export const updatedPassword = async (req, res) => {
  try {
    const { newPassword, confirmPassword, email } = req.body;
    const errors = { mismatchError: String };
    if (newPassword !== confirmPassword) {
      errors.mismatchError =
        "Your password and confirmation password do not match";
      return res.status(400).json(errors);
    }

    const faculty = await Faculty.findOne({ email });
    let hashedPassword;
    hashedPassword = await bcrypt.hash(newPassword, 10);
    faculty.password = hashedPassword;
    await faculty.save();
    if (faculty.passwordUpdated === false) {
      faculty.passwordUpdated = true;
      await faculty.save();
    }

    res.status(200).json({
      success: true,
      message: "Password updated successfully",
      response: faculty,
    });
  } catch (error) {
    const errors = { backendError: String };
    errors.backendError = error;
    res.status(500).json(errors);
  }
};

export const updateFaculty = async (req, res) => {
  try {
    const { name, dob, department, contactNumber, avatar, email, designation } =
      req.body;
    const updatedFaculty = await Faculty.findOne({ email });
    if (name) {
      updatedFaculty.name = name;
      await updatedFaculty.save();
    }
    if (dob) {
      updatedFaculty.dob = dob;
      await updatedFaculty.save();
    }
    if (department) {
      updatedFaculty.department = department;
      await updatedFaculty.save();
    }
    if (contactNumber) {
      updatedFaculty.contactNumber = contactNumber;
      await updatedFaculty.save();
    }
    if (designation) {
      updatedFaculty.designation = designation;
      await updatedFaculty.save();
    }
    if (avatar) {
      updatedFaculty.avatar = avatar;
      await updatedFaculty.save();
    }
    res.status(200).json(updatedFaculty);
  } catch (error) {
    const errors = { backendError: String };
    errors.backendError = error;
    res.status(500).json(errors);
  }
};

export const createTest = async (req, res) => {
  try {
    const { subjectCode, department, year, section, date, test, totalMarks } =
      req.body;
    const errors = { testError: String };
    const existingTest = await Test.findOne({
      subjectCode,
      department,
      year,
      section,
      test,
    });
    if (existingTest) {
      errors.testError = "Given Test is already created";
      return res.status(400).json(errors);
    }

    const newTest = await new Test({
      totalMarks,
      section,
      test,
      date,
      department,
      subjectCode,
      year,
    });

    await newTest.save();
    const students = await Student.find({ department, year, section });
    return res.status(200).json({
      success: true,
      message: "Test added successfully",
      response: newTest,
    });
  } catch (error) {
    const errors = { backendError: String };
    errors.backendError = error;
    res.status(500).json(errors);
  }
};

export const getTest = async (req, res) => {
  try {
    const { department, year, section } = req.body;

    const tests = await Test.find({ department, year, section });

    res.status(200).json({ result: tests });
  } catch (error) {
    const errors = { backendError: String };
    errors.backendError = error;
    res.status(500).json(errors);
  }
};

export const getStudent = async (req, res) => {
  try {
    const { department, year, section } = req.body;
    const errors = { noStudentError: String };
    const students = await Student.find({ department, year, section });
    if (students.length === 0) {
      errors.noStudentError = "No Student Found";
      return res.status(404).json(errors);
    }

    res.status(200).json({ result: students });
  } catch (error) {
    const errors = { backendError: String };
    errors.backendError = error;
    res.status(500).json(errors);
  }
};

export const uploadMarks = async (req, res) => {
  try {
    const { department, year, section, test, marks } = req.body;

    const errors = { examError: String };
    const existingTest = await Test.findOne({
      department,
      year,
      section,
      test,
    });
    const isAlready = await Marks.find({
      exam: existingTest._id,
    });

    if (isAlready.length !== 0) {
      errors.examError = "You have already uploaded marks of given exam";
      return res.status(400).json(errors);
    }

    for (var i = 0; i < marks.length; i++) {
      const newMarks = await new Marks({
        student: marks[i]._id,
        exam: existingTest._id,
        marks: marks[i].value,
      });
      await newMarks.save();
    }
    res.status(200).json({ message: "Marks uploaded successfully" });
  } catch (error) {
    const errors = { backendError: String };
    errors.backendError = error;
    res.status(500).json(errors);
  }
};

export const markAttendance = async (req, res) => {
  try {
    const { selectedStudents, subjectName, department, year, section } =
      req.body;

    const sub = await Subject.findOne({ subjectName });

    const allStudents = await Student.find({ department, year, section });

    for (let i = 0; i < allStudents.length; i++) {
      const pre = await Attendence.findOne({
        student: allStudents[i]._id,
        subject: sub._id,
      });
      if (!pre) {
        const attendence = new Attendence({
          student: allStudents[i]._id,
          subject: sub._id,
        });
        attendence.totalLecturesByFaculty += 1;
        await attendence.save();
      } else {
        pre.totalLecturesByFaculty += 1;
        await pre.save();
      }
    }

    for (var a = 0; a < selectedStudents.length; a++) {
      const pre = await Attendence.findOne({
        student: selectedStudents[a],
        subject: sub._id,
      });
      if (!pre) {
        const attendence = new Attendence({
          student: selectedStudents[a],
          subject: sub._id,
        });

        attendence.lectureAttended += 1;
        await attendence.save();
      } else {
        pre.lectureAttended += 1;
        await pre.save();
      }
    }
    res.status(200).json({ message: "Attendance Marked successfully" });
  } catch (error) {
    const errors = { backendError: String };
    errors.backendError = error;
    res.status(500).json(errors);
  }
};

export const createAssignment = async (req, res) => {
  try {
    const {
      title,
      subject,
      department,
      year,
      section,
      deadline,
      maxMarks,
      description,
      attachments,
    } = req.body;

    const errors = { assignmentError: String };

    if (!title || !subject || !department || !year || !section || !deadline) {
      errors.assignmentError =
        "title, subject, department, year, section and deadline are required";
      return res.status(400).json(errors);
    }

    const faculty = await Faculty.findById(req.userId);
    if (!faculty) {
      errors.assignmentError = "Faculty not found";
      return res.status(404).json(errors);
    }

    const totalStudents = await Student.countDocuments({
      department,
      year: Number(year),
      section,
    });

    const assignment = await Assignment.create({
      title: title.trim(),
      subject: subject.trim(),
      department: department.trim(),
      year: Number(year),
      section: section.trim(),
      deadline: new Date(deadline),
      maxMarks: Number(maxMarks) || 100,
      description: description?.trim() || "",
      attachments: sanitizeAttachments(attachments),
      totalStudents,
      createdBy: faculty._id,
      createdByName: faculty.name,
    });

    return res.status(201).json({
      success: true,
      message: "Assignment created successfully",
      result: assignment,
    });
  } catch (error) {
    return res.status(500).json({ backendError: error.message || error });
  }
};

export const getFacultyAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find({ createdBy: req.userId }).sort({
      createdAt: -1,
    });

    const assignmentIds = assignments.map((assignment) => assignment._id);
    const submissionCounts = await AssignmentSubmission.aggregate([
      { $match: { assignment: { $in: assignmentIds } } },
      { $group: { _id: "$assignment", count: { $sum: 1 } } },
    ]);

    const countMap = new Map(
      submissionCounts.map((item) => [String(item._id), item.count])
    );

    const result = assignments.map((assignment) => ({
      ...assignment.toObject(),
      submittedCount: countMap.get(String(assignment._id)) || 0,
    }));

    return res.status(200).json({ result });
  } catch (error) {
    return res.status(500).json({ backendError: error.message || error });
  }
};

export const updateAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const assignment = await Assignment.findOne({
      _id: assignmentId,
      createdBy: req.userId,
    });

    if (!assignment) {
      return res.status(404).json({ backendError: "Assignment not found" });
    }

    const {
      title,
      subject,
      department,
      year,
      section,
      deadline,
      maxMarks,
      description,
      attachments,
      isActive,
    } = req.body;

    if (title !== undefined) assignment.title = title.trim();
    if (subject !== undefined) assignment.subject = subject.trim();
    if (department !== undefined) assignment.department = department.trim();
    if (year !== undefined) assignment.year = Number(year);
    if (section !== undefined) assignment.section = section.trim();
    if (deadline !== undefined) assignment.deadline = new Date(deadline);
    if (maxMarks !== undefined) assignment.maxMarks = Number(maxMarks) || 100;
    if (description !== undefined)
      assignment.description = description?.trim() || "";
    if (attachments !== undefined)
      assignment.attachments = sanitizeAttachments(attachments);
    if (isActive !== undefined) assignment.isActive = Boolean(isActive);

    if (department !== undefined || year !== undefined || section !== undefined) {
      assignment.totalStudents = await Student.countDocuments({
        department: assignment.department,
        year: assignment.year,
        section: assignment.section,
      });
    }

    await assignment.save();

    return res.status(200).json({
      success: true,
      message: "Assignment updated successfully",
      result: assignment,
    });
  } catch (error) {
    return res.status(500).json({ backendError: error.message || error });
  }
};

export const deleteAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const assignment = await Assignment.findOneAndDelete({
      _id: assignmentId,
      createdBy: req.userId,
    });

    if (!assignment) {
      return res.status(404).json({ backendError: "Assignment not found" });
    }

    await AssignmentSubmission.deleteMany({ assignment: assignmentId });

    return res.status(200).json({
      success: true,
      message: "Assignment deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({ backendError: error.message || error });
  }
};

export const getAssignmentSubmissions = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const assignment = await Assignment.findOne({
      _id: assignmentId,
      createdBy: req.userId,
    });

    if (!assignment) {
      return res.status(404).json({ backendError: "Assignment not found" });
    }

    const submissions = await AssignmentSubmission.find({
      assignment: assignmentId,
    }).sort({ submittedAt: -1 });

    return res.status(200).json({ result: submissions });
  } catch (error) {
    return res.status(500).json({ backendError: error.message || error });
  }
};
