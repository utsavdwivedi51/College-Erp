import express from "express";
import {
  studentLogin,
  updatedPassword,
  updateStudent,
  testResult,
  attendance,
  getStudentAssignments,
  submitAssignment,
} from "../controller/studentController.js";
import { getStudentDashboardStats } from "../controller/dashboardController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/login", studentLogin);
router.post("/updatepassword", auth, updatedPassword);
router.post("/updateprofile", auth, updateStudent);
router.get("/dashboard-stats", auth, getStudentDashboardStats);
router.post("/testresult", auth, testResult);
router.post("/attendance", auth, attendance);
router.get("/assignments", auth, getStudentAssignments);
router.post("/assignments/:assignmentId/submit", auth, submitAssignment);

export default router;
