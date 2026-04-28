import express from "express";
import auth from "../middleware/auth.js";
import { getAdminDashboardStats } from "../controller/dashboardController.js";
import {
  assignFeeToStudent,
  assignFeeToBatch,
  getAdminFees,
  getFeeReportByClass,
} from "../controller/feeController.js";
import {
  adminLogin,
  updateAdmin,
  addAdmin,
  addFaculty,
  getFaculty,
  addSubject,
  getSubject,
  addStudent,
  getStudent,
  addDepartment,
  getAllStudent,
  getAllFaculty,
  getAllAdmin,
  getAllDepartment,
  getAllSubject,
  updatedPassword,
  getAdmin,
  deleteAdmin,
  deleteDepartment,
  deleteFaculty,
  deleteStudent,
  deleteSubject,
  createNotice,
  getNotice,
  bulkAddFaculty,
  bulkAddStudent,
  bulkUpdateUserStatus,
} from "../controller/adminController.js";
const router = express.Router();

router.post("/login", adminLogin);
router.post("/updatepassword", auth, updatedPassword);
router.get("/dashboard-stats", auth, getAdminDashboardStats);
router.get("/getallstudent", auth, getAllStudent);
router.post("/createnotice", auth, createNotice);
router.get("/getallfaculty", auth, getAllFaculty);
router.get("/getalldepartment", auth, getAllDepartment);
router.get("/getallsubject", auth, getAllSubject);
router.get("/getalladmin", auth, getAllAdmin);
router.post("/updateprofile", auth, updateAdmin);
router.post("/addadmin", auth, addAdmin);
router.post("/adddepartment", auth, addDepartment);
router.post("/addfaculty", auth, addFaculty);
router.post("/bulkaddfaculty", auth, bulkAddFaculty);
router.post("/getfaculty", auth, getFaculty);
router.post("/addsubject", auth, addSubject);
router.post("/getsubject", auth, getSubject);
router.post("/addstudent", auth, addStudent);
router.post("/bulkaddstudent", auth, bulkAddStudent);
router.post("/getstudent", auth, getStudent);
router.post("/bulkupdatestatus", auth, bulkUpdateUserStatus);
router.post("/getnotice", auth, getNotice);
router.post("/getadmin", auth, getAdmin);
router.post("/deleteadmin", auth, deleteAdmin);
router.post("/deletefaculty", auth, deleteFaculty);
router.post("/deletestudent", auth, deleteStudent);
router.post("/deletedepartment", auth, deleteDepartment);
router.post("/deletesubject", auth, deleteSubject);
router.get("/fees", auth, getAdminFees);
router.post("/fees/assign", auth, assignFeeToStudent);
router.post("/fees/batch", auth, assignFeeToBatch);
router.get("/fees/report", auth, getFeeReportByClass);

export default router;
