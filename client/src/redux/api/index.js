import axios from "axios";

// const API = axios.create({ baseURL: process.env.REACT_APP_SERVER_URL });
const API = axios.create({ baseURL: "http://localhost:5001/" });

API.interceptors.request.use((req) => {
  if (localStorage.getItem("user")) {
    req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem("user")).token
      }`;
  }
  return req;
});

// Admin

export const adminSignIn = (formData) => API.post("/api/admin/login", formData);

export const adminUpdatePassword = (updatedPassword) =>
  API.post("/api/admin/updatepassword", updatedPassword);

export const getAllStudent = () => API.get("/api/admin/getallstudent");

export const getAllFaculty = () => API.get("/api/admin/getallfaculty");

export const getAllAdmin = () => API.get("/api/admin/getalladmin");

export const getAllDepartment = () => API.get("/api/admin/getalldepartment");
export const getAllSubject = () => API.get("/api/admin/getallsubject");

export const updateAdmin = (updatedAdmin) =>
  API.post("/api/admin/updateprofile", updatedAdmin);

export const addAdmin = (admin) => API.post("/api/admin/addadmin", admin);
export const createNotice = (notice) =>
  API.post("/api/admin/createnotice", notice);
export const deleteAdmin = (data) => API.post("/api/admin/deleteadmin", data);
export const deleteFaculty = (data) =>
  API.post("/api/admin/deletefaculty", data);
export const deleteStudent = (data) =>
  API.post("/api/admin/deletestudent", data);
export const deleteSubject = (data) =>
  API.post("/api/admin/deletesubject", data);
export const deleteDepartment = (data) =>
  API.post("/api/admin/deletedepartment", data);

export const getAdmin = (admin) => API.post("/api/admin/getadmin", admin);

export const addDepartment = (department) =>
  API.post("/api/admin/adddepartment", department);

export const addFaculty = (faculty) =>
  API.post("/api/admin/addfaculty", faculty);
export const bulkAddFaculty = (facultyList) =>
  API.post("/api/admin/bulkaddfaculty", { facultyList });

export const getFaculty = (department) =>
  API.post("/api/admin/getfaculty", department);

export const addSubject = (subject) =>
  API.post("/api/admin/addsubject", subject);
export const getSubject = (subject) =>
  API.post("/api/admin/getsubject", subject);

export const addStudent = (student) =>
  API.post("/api/admin/addstudent", student);
export const bulkAddStudent = (studentList) =>
  API.post("/api/admin/bulkaddstudent", { studentList });

export const bulkUpdateUserStatus = (formData) =>
  API.post("/api/admin/bulkupdatestatus", formData);

export const getStudent = (student) =>
  API.post("/api/admin/getstudent", student);
export const getNotice = (notice) => API.post("/api/admin/getnotice", notice);
export const getAdminDashboardStats = () =>
  API.get("/api/admin/dashboard-stats");

// Faculty

export const facultySignIn = (formData) =>
  API.post("/api/faculty/login", formData);

export const facultyUpdatePassword = (updatedPassword) =>
  API.post("/api/faculty/updatepassword", updatedPassword);

export const updateFaculty = (updatedFaculty) =>
  API.post("/api/faculty/updateprofile", updatedFaculty);

export const createTest = (test) => API.post("/api/faculty/createtest", test);
export const getTest = (test) => API.post("/api/faculty/gettest", test);
export const getMarksStudent = (student) =>
  API.post("/api/faculty/getstudent", student);
export const uploadMarks = (data) => API.post("/api/faculty/uploadmarks", data);
export const markAttendance = (data) =>
  API.post("/api/faculty/markattendance", data);
export const createAssignment = (data) => API.post("/api/faculty/assignments", data);
export const getFacultyAssignments = () => API.get("/api/faculty/assignments");
export const updateAssignment = (assignmentId, data) =>
  API.patch(`/api/faculty/assignments/${assignmentId}`, data);
export const deleteAssignment = (assignmentId) =>
  API.delete(`/api/faculty/assignments/${assignmentId}`);
export const getAssignmentSubmissions = (assignmentId) =>
  API.get(`/api/faculty/assignments/${assignmentId}/submissions`);
export const getFacultyDashboardStats = () =>
  API.get("/api/faculty/dashboard-stats");

// Student

export const studentSignIn = (formData) =>
  API.post("/api/student/login", formData);

export const studentUpdatePassword = (updatedPassword) =>
  API.post("/api/student/updatepassword", updatedPassword);

export const updateStudent = (updatedStudent) =>
  API.post("/api/student/updateprofile", updatedStudent);
export const getTestResult = (testResult) =>
  API.post("/api/student/testresult", testResult);
export const getAttendance = (attendance) =>
  API.post("/api/student/attendance", attendance);
export const getStudentAssignments = () => API.get("/api/student/assignments");
export const submitAssignment = (assignmentId, data) =>
  API.post(`/api/student/assignments/${assignmentId}/submit`, data);
export const getStudentDashboardStats = () =>
  API.get("/api/student/dashboard-stats");
