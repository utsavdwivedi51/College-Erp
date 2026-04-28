import express from "express";
import {
  facultyLogin,
  updatedPassword,
  updateFaculty,
  createTest,
  getTest,
  getStudent,
  uploadMarks,
  markAttendance,
  createAssignment,
  getFacultyAssignments,
  updateAssignment,
  deleteAssignment,
  getAssignmentSubmissions,
} from "../controller/facultyController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/login", facultyLogin);
router.post("/updatepassword", auth, updatedPassword);
router.post("/updateprofile", auth, updateFaculty);
router.post("/createtest", auth, createTest);
router.post("/gettest", auth, getTest);
router.post("/getstudent", auth, getStudent);
router.post("/uploadmarks", auth, uploadMarks);
router.post("/markattendance", auth, markAttendance);
router.post("/assignments", auth, createAssignment);
router.get("/assignments", auth, getFacultyAssignments);
router.patch("/assignments/:assignmentId", auth, updateAssignment);
router.delete("/assignments/:assignmentId", auth, deleteAssignment);
router.get(
  "/assignments/:assignmentId/submissions",
  auth,
  getAssignmentSubmissions
);

export default router;
