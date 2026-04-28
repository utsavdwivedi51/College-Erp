import Admin from "../models/admin.js";
import Department from "../models/department.js";
import Faculty from "../models/faculty.js";
import Student from "../models/student.js";
import Subject from "../models/subject.js";
import Notice from "../models/notice.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const formatSequence = (value) => {
  if (value < 10) return `00${value}`;
  if (value < 100) return `0${value}`;
  return `${value}`;
};

const normalizeDobPassword = (dob) => {
  if (!dob || typeof dob !== "string") return "123456";
  if (dob.includes("-")) {
    const chunks = dob.split("-");
    if (chunks.length === 3) return chunks.reverse().join("-");
  }
  return dob;
};

const parseOptionalNumber = (value) => {
  if (value === undefined || value === null || value === "") return undefined;
  const num = Number(value);
  return Number.isNaN(num) ? undefined : num;
};

const createUsername = ({ prefix, year, departmentCode, sequence }) =>
  `${prefix}${year}${departmentCode}${formatSequence(sequence)}`;

export const adminLogin = async (req, res) => {
  const { username, password } = req.body;
  const errors = { usernameError: String, passwordError: String };
  try {
    const existingAdmin = await Admin.findOne({ username });
    if (!existingAdmin) {
      errors.usernameError = "Admin doesn't exist.";
      return res.status(404).json(errors);
    }
    if (existingAdmin.isActive === false) {
      errors.passwordError = "Account is inactive. Please contact super admin.";
      return res.status(403).json(errors);
    }
    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingAdmin.password
    );
    if (!isPasswordCorrect) {
      errors.passwordError = "Invalid Credentials";
      return res.status(404).json(errors);
    }

    const token = jwt.sign(
      {
        email: existingAdmin.email,
        id: existingAdmin._id,
      },
      "sEcReT",
      { expiresIn: "1h" }
    );

    res.status(200).json({ result: existingAdmin, token: token });
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

    const admin = await Admin.findOne({ email });
    let hashedPassword;
    hashedPassword = await bcrypt.hash(newPassword, 10);
    admin.password = hashedPassword;
    await admin.save();
    if (admin.passwordUpdated === false) {
      admin.passwordUpdated = true;
      await admin.save();
    }

    res.status(200).json({
      success: true,
      message: "Password updated successfully",
      response: admin,
    });
  } catch (error) {
    const errors = { backendError: String };
    errors.backendError = error;
    res.status(500).json(errors);
  }
};
export const updateAdmin = async (req, res) => {
  try {
    const { name, dob, department, contactNumber, avatar, email } = req.body;
    const updatedAdmin = await Admin.findOne({ email });
    if (name) {
      updatedAdmin.name = name;
      await updatedAdmin.save();
    }
    if (dob) {
      updatedAdmin.dob = dob;
      await updatedAdmin.save();
    }
    if (department) {
      updatedAdmin.department = department;
      await updatedAdmin.save();
    }
    if (contactNumber) {
      updatedAdmin.contactNumber = contactNumber;
      await updatedAdmin.save();
    }
    if (avatar) {
      updatedAdmin.avatar = avatar;
      await updatedAdmin.save();
    }
    res.status(200).json(updatedAdmin);
  } catch (error) {
    const errors = { backendError: String };
    errors.backendError = error;
    res.status(500).json(errors);
  }
};

export const addAdmin = async (req, res) => {
  try {
    const { name, dob, department, contactNumber, avatar, email, joiningYear } =
      req.body;
    const errors = { emailError: String };
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      errors.emailError = "Email already exists";
      return res.status(400).json(errors);
    }
    const existingDepartment = await Department.findOne({ department });
    let departmentHelper = existingDepartment.departmentCode;
    const admins = await Admin.find({ department });

    let helper;
    if (admins.length < 10) {
      helper = "00" + admins.length.toString();
    } else if (admins.length < 100 && admins.length > 9) {
      helper = "0" + admins.length.toString();
    } else {
      helper = admins.length.toString();
    }
    var date = new Date();
    var components = ["ADM", date.getFullYear(), departmentHelper, helper];

    var username = components.join("");
    let hashedPassword;
    const newDob = dob.split("-").reverse().join("-");

    hashedPassword = await bcrypt.hash(newDob, 10);
    var passwordUpdated = false;
    const newAdmin = await new Admin({
      name,
      email,
      password: hashedPassword,
      joiningYear,
      username,
      department,
      avatar,
      contactNumber,
      dob,
      passwordUpdated,
    });
    await newAdmin.save();
    return res.status(200).json({
      success: true,
      message: "Admin registerd successfully",
      response: newAdmin,
    });
  } catch (error) {
    const errors = { backendError: String };
    errors.backendError = error;
    res.status(500).json(errors);
  }
};
export const addDummyAdmin = async () => {
  const email = "dummy@gmail.com";
  const password = "123";
  const name = "dummy";
  const username = "ADMDUMMY";
  let hashedPassword;
  hashedPassword = await bcrypt.hash(password, 10);
  var passwordUpdated = true;

  const dummyAdmin = await Admin.findOne({ email });

  if (!dummyAdmin) {
    await Admin.create({
      name,
      email,
      password: hashedPassword,
      username,
      passwordUpdated,
    });
    console.log("Dummy user added.");
  } else {
    console.log("Dummy user already exists.");
  }
};

export const createNotice = async (req, res) => {
  try {
    const { from, content, topic, date, noticeFor } = req.body;

    const errors = { noticeError: String };
    const exisitingNotice = await Notice.findOne({ topic, content, date });
    if (exisitingNotice) {
      errors.noticeError = "Notice already created";
      return res.status(400).json(errors);
    }
    const newNotice = await new Notice({
      from,
      content,
      topic,
      noticeFor,
      date,
    });
    await newNotice.save();
    return res.status(200).json({
      success: true,
      message: "Notice created successfully",
      response: newNotice,
    });
  } catch (error) {
    const errors = { backendError: String };
    errors.backendError = error;
    res.status(500).json(errors);
  }
};

export const addDepartment = async (req, res) => {
  try {
    const errors = { departmentError: String };
    const { department } = req.body;
    const existingDepartment = await Department.findOne({ department });
    if (existingDepartment) {
      errors.departmentError = "Department already added";
      return res.status(400).json(errors);
    }
    const departments = await Department.find({});
    let add = departments.length + 1;
    let departmentCode;
    if (add < 9) {
      departmentCode = "0" + add.toString();
    } else {
      departmentCode = add.toString();
    }

    const newDepartment = await new Department({
      department,
      departmentCode,
    });

    await newDepartment.save();
    return res.status(200).json({
      success: true,
      message: "Department added successfully",
      response: newDepartment,
    });
  } catch (error) {
    const errors = { backendError: String };
    errors.backendError = error;
    res.status(500).json(errors);
  }
};

export const addFaculty = async (req, res) => {
  try {
    const {
      name,
      dob,
      department,
      contactNumber,
      avatar,
      email,
      joiningYear,
      gender,
      designation,
    } = req.body;
    const errors = { emailError: String };
    const existingFaculty = await Faculty.findOne({ email });
    if (existingFaculty) {
      errors.emailError = "Email already exists";
      return res.status(400).json(errors);
    }
    const existingDepartment = await Department.findOne({ department });
    let departmentHelper = existingDepartment.departmentCode;

    const faculties = await Faculty.find({ department });
    let helper;
    if (faculties.length < 10) {
      helper = "00" + faculties.length.toString();
    } else if (faculties.length < 100 && faculties.length > 9) {
      helper = "0" + faculties.length.toString();
    } else {
      helper = faculties.length.toString();
    }
    var date = new Date();
    var components = ["FAC", date.getFullYear(), departmentHelper, helper];

    var username = components.join("");
    let hashedPassword;
    const newDob = dob.split("-").reverse().join("-");

    hashedPassword = await bcrypt.hash(newDob, 10);
    var passwordUpdated = false;

    const newFaculty = await new Faculty({
      name,
      email,
      password: hashedPassword,
      joiningYear,
      username,
      department,
      avatar,
      contactNumber,
      dob,
      gender,
      designation,
      passwordUpdated,
    });
    await newFaculty.save();
    return res.status(200).json({
      success: true,
      message: "Faculty registerd successfully",
      response: newFaculty,
      credentials: {
        username,
        initialPassword: newDob,
      },
    });
  } catch (error) {
    const errors = { backendError: String };
    errors.backendError = error;
    res.status(500).json(errors);
  }
};

export const getFaculty = async (req, res) => {
  try {
    const { department } = req.body;
    const errors = { noFacultyError: String };
    const faculties = await Faculty.find({ department });
    if (faculties.length === 0) {
      errors.noFacultyError = "No Faculty Found";
      return res.status(404).json(errors);
    }
    res.status(200).json({ result: faculties });
  } catch (error) {
    const errors = { backendError: String };
    errors.backendError = error;
    res.status(500).json(errors);
  }
};
export const getNotice = async (req, res) => {
  try {
    const errors = { noNoticeError: String };
    const notices = await Notice.find({});
    if (notices.length === 0) {
      errors.noNoticeError = "No Notice Found";
      return res.status(404).json(errors);
    }
    res.status(200).json({ result: notices });
  } catch (error) {
    const errors = { backendError: String };
    errors.backendError = error;
    res.status(500).json(errors);
  }
};

export const addSubject = async (req, res) => {
  try {
    const { totalLectures, department, subjectCode, subjectName, year } =
      req.body;
    const errors = { subjectError: String };
    const subject = await Subject.findOne({ subjectCode });
    if (subject) {
      errors.subjectError = "Given Subject is already added";
      return res.status(400).json(errors);
    }

    const newSubject = await new Subject({
      totalLectures,
      department,
      subjectCode,
      subjectName,
      year,
    });

    await newSubject.save();
    const students = await Student.find({ department, year });
    if (students.length !== 0) {
      for (var i = 0; i < students.length; i++) {
        students[i].subjects.push(newSubject._id);
        await students[i].save();
      }
    }
    return res.status(200).json({
      success: true,
      message: "Subject added successfully",
      response: newSubject,
    });
  } catch (error) {
    const errors = { backendError: String };
    errors.backendError = error;
    res.status(500).json(errors);
  }
};

export const getSubject = async (req, res) => {
  try {
    const { department, year } = req.body;

    if (!req.userId) return res.json({ message: "Unauthenticated" });
    const errors = { noSubjectError: String };

    const subjects = await Subject.find({ department, year });
    if (subjects.length === 0) {
      errors.noSubjectError = "No Subject Found";
      return res.status(404).json(errors);
    }
    res.status(200).json({ result: subjects });
  } catch (error) {
    const errors = { backendError: String };
    errors.backendError = error;
    res.status(500).json(errors);
  }
};

export const getAdmin = async (req, res) => {
  try {
    const { department } = req.body;

    const errors = { noAdminError: String };

    const admins = await Admin.find({ department });
    if (admins.length === 0) {
      errors.noAdminError = "No Subject Found";
      return res.status(404).json(errors);
    }
    res.status(200).json({ result: admins });
  } catch (error) {
    const errors = { backendError: String };
    errors.backendError = error;
    res.status(500).json(errors);
  }
};

export const deleteAdmin = async (req, res) => {
  try {
    const admins = req.body;
    const errors = { noAdminError: String };
    for (var i = 0; i < admins.length; i++) {
      var admin = admins[i];

      await Admin.findOneAndDelete({ _id: admin });
    }
    res.status(200).json({ message: "Admin Deleted" });
  } catch (error) {
    const errors = { backendError: String };
    errors.backendError = error;
    res.status(500).json(errors);
  }
};
export const deleteFaculty = async (req, res) => {
  try {
    const faculties = req.body;
    const errors = { noFacultyError: String };
    for (var i = 0; i < faculties.length; i++) {
      var faculty = faculties[i];

      await Faculty.findOneAndDelete({ _id: faculty });
    }
    res.status(200).json({ message: "Faculty Deleted" });
  } catch (error) {
    const errors = { backendError: String };
    errors.backendError = error;
    res.status(500).json(errors);
  }
};
export const deleteStudent = async (req, res) => {
  try {
    const students = req.body;
    const errors = { noStudentError: String };
    for (var i = 0; i < students.length; i++) {
      var student = students[i];

      await Student.findOneAndDelete({ _id: student });
    }
    res.status(200).json({ message: "Student Deleted" });
  } catch (error) {
    const errors = { backendError: String };
    errors.backendError = error;
    res.status(500).json(errors);
  }
};
export const deleteSubject = async (req, res) => {
  try {
    const subjects = req.body;
    const errors = { noSubjectError: String };
    for (var i = 0; i < subjects.length; i++) {
      var subject = subjects[i];

      await Subject.findOneAndDelete({ _id: subject });
    }
    res.status(200).json({ message: "Subject Deleted" });
  } catch (error) {
    const errors = { backendError: String };
    errors.backendError = error;
    res.status(500).json(errors);
  }
};

export const deleteDepartment = async (req, res) => {
  try {
    const { department } = req.body;

    await Department.findOneAndDelete({ department });

    res.status(200).json({ message: "Department Deleted" });
  } catch (error) {
    const errors = { backendError: String };
    errors.backendError = error;
    res.status(500).json(errors);
  }
};

export const addStudent = async (req, res) => {
  try {
    const {
      name,
      dob,
      department,
      contactNumber,
      avatar,
      email,
      section,
      gender,
      batch,
      fatherName,
      motherName,
      fatherContactNumber,
      motherContactNumber,
      year,
    } = req.body;
    const errors = { emailError: String };
    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      errors.emailError = "Email already exists";
      return res.status(400).json(errors);
    }
    const existingDepartment = await Department.findOne({ department });
    let departmentHelper = existingDepartment.departmentCode;

    const students = await Student.find({ department });
    let helper;
    if (students.length < 10) {
      helper = "00" + students.length.toString();
    } else if (students.length < 100 && students.length > 9) {
      helper = "0" + students.length.toString();
    } else {
      helper = students.length.toString();
    }
    var date = new Date();
    var components = ["STU", date.getFullYear(), departmentHelper, helper];

    var username = components.join("");
    let hashedPassword;
    const newDob = dob.split("-").reverse().join("-");

    hashedPassword = await bcrypt.hash(newDob, 10);
    var passwordUpdated = false;

    const newStudent = await new Student({
      name,
      dob,
      password: hashedPassword,
      username,
      department,
      contactNumber,
      avatar,
      email,
      section,
      gender,
      batch,
      fatherName,
      motherName,
      fatherContactNumber,
      motherContactNumber,
      year,
      passwordUpdated,
    });
    await newStudent.save();
    const subjects = await Subject.find({ department, year });
    if (subjects.length !== 0) {
      for (var i = 0; i < subjects.length; i++) {
        newStudent.subjects.push(subjects[i]._id);
      }
    }
    await newStudent.save();
    return res.status(200).json({
      success: true,
      message: "Student registerd successfully",
      response: newStudent,
    });
  } catch (error) {
    const errors = { backendError: String };
    errors.backendError = error;
    res.status(500).json(errors);
  }
};

export const bulkAddFaculty = async (req, res) => {
  try {
    const { facultyList } = req.body;
    if (!Array.isArray(facultyList) || facultyList.length === 0) {
      return res.status(400).json({
        backendError: "facultyList must be a non-empty array",
      });
    }

    const departmentList = await Department.find({}).select(
      "department departmentCode"
    );
    const deptCodeByName = new Map(
      departmentList.map((dep) => [dep.department, dep.departmentCode])
    );

    const counts = await Faculty.aggregate([
      { $group: { _id: "$department", count: { $sum: 1 } } },
    ]);
    const facultyCountByDepartment = new Map(
      counts.map((item) => [item._id, item.count])
    );

    const existingFaculty = await Faculty.find({}).select("email");
    const existingEmails = new Set(
      existingFaculty.map((item) => (item.email || "").toLowerCase())
    );
    const seenInRequest = new Set();

    const docsToInsert = [];
    const failures = [];
    const credentials = [];

    for (let i = 0; i < facultyList.length; i += 1) {
      const row = facultyList[i] || {};
      const rowNumber = i + 1;
      const name = row.name?.trim();
      const email = row.email?.trim().toLowerCase();
      const dob = row.dob?.trim();
      const department = row.department?.trim();
      const designation = row.designation?.trim();
      const joiningYear = Number(row.joiningYear) || new Date().getFullYear();

      if (!name || !email || !dob || !department || !designation) {
        failures.push({
          row: rowNumber,
          reason:
            "Required fields missing. Required: name,email,dob,department,designation",
        });
        continue;
      }

      if (!deptCodeByName.has(department)) {
        failures.push({
          row: rowNumber,
          reason: `Department not found: ${department}`,
        });
        continue;
      }

      if (existingEmails.has(email) || seenInRequest.has(email)) {
        failures.push({ row: rowNumber, reason: `Email already exists: ${email}` });
        continue;
      }

      seenInRequest.add(email);
      const count = facultyCountByDepartment.get(department) || 0;
      const username = createUsername({
        prefix: "FAC",
        year: new Date().getFullYear(),
        departmentCode: deptCodeByName.get(department),
        sequence: count,
      });
      facultyCountByDepartment.set(department, count + 1);

      const initialPassword = normalizeDobPassword(dob);
      const hashedPassword = await bcrypt.hash(initialPassword, 10);

      docsToInsert.push({
        name,
        email,
        dob,
        department,
        designation,
        joiningYear,
        gender: row.gender,
        avatar: row.avatar,
        contactNumber: parseOptionalNumber(row.contactNumber),
        username,
        password: hashedPassword,
        passwordUpdated: false,
        isActive: true,
      });

      credentials.push({ row: rowNumber, email, username, initialPassword });
      existingEmails.add(email);
    }

    if (docsToInsert.length > 0) {
      await Faculty.insertMany(docsToInsert);
    }

    return res.status(200).json({
      success: true,
      message: "Bulk faculty operation completed",
      summary: {
        total: facultyList.length,
        created: docsToInsert.length,
        failed: failures.length,
      },
      credentials,
      failures,
    });
  } catch (error) {
    return res.status(500).json({ backendError: error.message || error });
  }
};

export const bulkAddStudent = async (req, res) => {
  try {
    const { studentList } = req.body;
    if (!Array.isArray(studentList) || studentList.length === 0) {
      return res.status(400).json({
        backendError: "studentList must be a non-empty array",
      });
    }

    const departmentList = await Department.find({}).select(
      "department departmentCode"
    );
    const deptCodeByName = new Map(
      departmentList.map((dep) => [dep.department, dep.departmentCode])
    );

    const counts = await Student.aggregate([
      { $group: { _id: "$department", count: { $sum: 1 } } },
    ]);
    const studentCountByDepartment = new Map(
      counts.map((item) => [item._id, item.count])
    );

    const existingStudents = await Student.find({}).select("email");
    const existingEmails = new Set(
      existingStudents.map((item) => (item.email || "").toLowerCase())
    );
    const seenInRequest = new Set();

    const docsToInsert = [];
    const failures = [];
    const credentials = [];

    for (let i = 0; i < studentList.length; i += 1) {
      const row = studentList[i] || {};
      const rowNumber = i + 1;
      const name = row.name?.trim();
      const email = row.email?.trim().toLowerCase();
      const dob = row.dob?.trim();
      const department = row.department?.trim();
      const section = row.section?.trim();
      const year = Number(row.year);

      if (!name || !email || !dob || !department || !section || !year) {
        failures.push({
          row: rowNumber,
          reason:
            "Required fields missing. Required: name,email,dob,department,section,year",
        });
        continue;
      }

      if (!deptCodeByName.has(department)) {
        failures.push({
          row: rowNumber,
          reason: `Department not found: ${department}`,
        });
        continue;
      }

      if (existingEmails.has(email) || seenInRequest.has(email)) {
        failures.push({ row: rowNumber, reason: `Email already exists: ${email}` });
        continue;
      }

      seenInRequest.add(email);
      const count = studentCountByDepartment.get(department) || 0;
      const username = createUsername({
        prefix: "STU",
        year: new Date().getFullYear(),
        departmentCode: deptCodeByName.get(department),
        sequence: count,
      });
      studentCountByDepartment.set(department, count + 1);

      const initialPassword = normalizeDobPassword(dob);
      const hashedPassword = await bcrypt.hash(initialPassword, 10);

      docsToInsert.push({
        name,
        email,
        dob,
        department,
        section,
        year,
        gender: row.gender,
        batch: row.batch,
        fatherName: row.fatherName,
        motherName: row.motherName,
        fatherContactNumber: parseOptionalNumber(row.fatherContactNumber),
        motherContactNumber: parseOptionalNumber(row.motherContactNumber),
        contactNumber: parseOptionalNumber(row.contactNumber),
        avatar: row.avatar,
        username,
        password: hashedPassword,
        passwordUpdated: false,
        isActive: true,
      });

      credentials.push({ row: rowNumber, email, username, initialPassword });
      existingEmails.add(email);
    }

    let insertedStudents = [];
    if (docsToInsert.length > 0) {
      insertedStudents = await Student.insertMany(docsToInsert);

      const deptYearKeys = [
        ...new Set(insertedStudents.map((item) => `${item.department}::${item.year}`)),
      ];
      const subjectMap = new Map();

      for (let i = 0; i < deptYearKeys.length; i += 1) {
        const [department, year] = deptYearKeys[i].split("::");
        const subjects = await Subject.find({ department, year: Number(year) }).select(
          "_id"
        );
        subjectMap.set(deptYearKeys[i], subjects.map((subject) => subject._id));
      }

      const studentSubjectUpdates = insertedStudents.map((item) => ({
        updateOne: {
          filter: { _id: item._id },
          update: {
            $set: {
              subjects: subjectMap.get(`${item.department}::${item.year}`) || [],
            },
          },
        },
      }));

      if (studentSubjectUpdates.length > 0) {
        await Student.bulkWrite(studentSubjectUpdates);
      }
    }

    return res.status(200).json({
      success: true,
      message: "Bulk student operation completed",
      summary: {
        total: studentList.length,
        created: docsToInsert.length,
        failed: failures.length,
      },
      credentials,
      failures,
    });
  } catch (error) {
    return res.status(500).json({ backendError: error.message || error });
  }
};

export const bulkUpdateUserStatus = async (req, res) => {
  try {
    const { role, identifierField = "_id", identifiers, isActive } = req.body;
    const allowedRoles = {
      student: Student,
      faculty: Faculty,
      admin: Admin,
    };
    const allowedIdentifierFields = ["_id", "username", "email"];

    if (!allowedRoles[role]) {
      return res.status(400).json({ backendError: "Invalid role" });
    }

    if (!allowedIdentifierFields.includes(identifierField)) {
      return res.status(400).json({
        backendError: "identifierField must be one of: _id, username, email",
      });
    }

    if (!Array.isArray(identifiers) || identifiers.length === 0) {
      return res.status(400).json({ backendError: "identifiers must be a non-empty array" });
    }

    const cleanIdentifiers = [
      ...new Set(
        identifiers
          .map((item) => (item || "").toString().trim())
          .filter((item) => item.length > 0)
      ),
    ];

    if (cleanIdentifiers.length === 0) {
      return res.status(400).json({ backendError: "No valid identifiers provided" });
    }

    const Model = allowedRoles[role];
    const result = await Model.updateMany(
      { [identifierField]: { $in: cleanIdentifiers } },
      { $set: { isActive: Boolean(isActive) } }
    );

    return res.status(200).json({
      success: true,
      message: `${role} status updated successfully`,
      summary: {
        requested: cleanIdentifiers.length,
        matched: result.matchedCount,
        modified: result.modifiedCount,
      },
    });
  } catch (error) {
    return res.status(500).json({ backendError: error.message || error });
  }
};

export const getStudent = async (req, res) => {
  try {
    const { department, year, section } = req.body;
    const errors = { noStudentError: String };
    const students = await Student.find({ department, year });

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
export const getAllStudent = async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).json(students);
  } catch (error) {
    console.log("Backend Error", error);
  }
};

export const getAllFaculty = async (req, res) => {
  try {
    const faculties = await Faculty.find();
    res.status(200).json(faculties);
  } catch (error) {
    console.log("Backend Error", error);
  }
};

export const getAllAdmin = async (req, res) => {
  try {
    const admins = await Admin.find();
    res.status(200).json(admins);
  } catch (error) {
    console.log("Backend Error", error);
  }
};
export const getAllDepartment = async (req, res) => {
  try {
    const departments = await Department.find();
    res.status(200).json(departments);
  } catch (error) {
    console.log("Backend Error", error);
  }
};
export const getAllSubject = async (req, res) => {
  try {
    const subjects = await Subject.find();
    res.status(200).json(subjects);
  } catch (error) {
    console.log("Backend Error", error);
  }
};
