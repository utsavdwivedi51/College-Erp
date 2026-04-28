import Student from "../models/student.js";
import Faculty from "../models/faculty.js";
import Admin from "../models/admin.js";
import Department from "../models/department.js";
import Test from "../models/test.js";
import Marks from "../models/marks.js";
import Attendance from "../models/attendance.js";
import Subject from "../models/subject.js";

export const getAdminDashboardStats = async (req, res) => {
  try {
    // 1. Department-wise Pass %
    const allTests = await Test.find();
    const allMarks = await Marks.find().populate("student exam");

    // Group tests by department
    const deptPassStats = {};
    allMarks.forEach((mark) => {
      if (!mark.student || !mark.exam) return;
      const dept = mark.student.department;
      if (!deptPassStats[dept]) {
        deptPassStats[dept] = { total: 0, passed: 0 };
      }
      deptPassStats[dept].total += 1;
      // Assuming passing mark is 40% of totalMarks
      const passMark = mark.exam.totalMarks * 0.4;
      if (mark.marks >= passMark) {
        deptPassStats[dept].passed += 1;
      }
    });

    const passPercentageData = Object.keys(deptPassStats).map((dept) => ({
      name: dept,
      passPercentage: Math.round(
        (deptPassStats[dept].passed / deptPassStats[dept].total) * 100
      ),
    }));

    // 2. Faculty load distribution (faculty count per department)
    const faculties = await Faculty.find();
    const facultyCountByDept = {};
    faculties.forEach((f) => {
      const dept = f.department;
      if (!facultyCountByDept[dept]) facultyCountByDept[dept] = 0;
      facultyCountByDept[dept] += 1;
    });

    const facultyDistributionData = Object.keys(facultyCountByDept).map(
      (dept) => ({
        name: dept,
        count: facultyCountByDept[dept],
      })
    );

    // 3. Enrollment trends
    const students = await Student.find();
    const enrollmentByYear = {};
    students.forEach((s) => {
      const year = s.batch || s.year;
      if (!enrollmentByYear[year]) enrollmentByYear[year] = 0;
      enrollmentByYear[year] += 1;
    });

    const enrollmentTrendsData = Object.keys(enrollmentByYear)
      .sort()
      .map((year) => ({
        name: year.toString(),
        students: enrollmentByYear[year],
      }));

    res.status(200).json({
      success: true,
      result: {
        passPercentageData,
        facultyDistributionData,
        enrollmentTrendsData,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getFacultyDashboardStats = async (req, res) => {
  try {
    const facultyId = req.userId;
    const faculty = await Faculty.findById(facultyId);

    if (!faculty) {
      return res.status(404).json({ message: "Faculty not found" });
    }

    const dept = faculty.department;

    // 1. Class average per test (for their department)
    const tests = await Test.find({ department: dept });
    const testIds = tests.map((t) => t._id);
    const marks = await Marks.find({ exam: { $in: testIds } }).populate("exam student");

    const testAverages = {};
    marks.forEach((m) => {
      if (!m.exam) return;
      const testName = `${m.exam.test} (${m.exam.subjectCode})`;
      if (!testAverages[testName]) {
        testAverages[testName] = { totalMarks: 0, count: 0 };
      }
      if (m.marks >= 0) { // Exclude absent (-1)
          testAverages[testName].totalMarks += m.marks;
          testAverages[testName].count += 1;
      }
    });

    const classAverageData = Object.keys(testAverages).map((testName) => ({
      name: testName,
      average: Math.round(
        testAverages[testName].totalMarks / testAverages[testName].count || 0
      ),
    }));

    // 2. Top / Bottom Performers (aggregate total marks per student in dept)
    const studentPerformance = {};
    marks.forEach((m) => {
      if (!m.student) return;
      const studentName = m.student.name;
      if (!studentPerformance[studentName]) {
        studentPerformance[studentName] = { total: 0, count: 0 };
      }
      if (m.marks >= 0) {
          studentPerformance[studentName].total += m.marks;
          studentPerformance[studentName].count += 1;
      }
    });

    const performersArray = Object.keys(studentPerformance)
      .map((name) => ({
        name,
        average: Math.round(
          studentPerformance[name].total / studentPerformance[name].count || 0
        ),
      }))
      .sort((a, b) => b.average - a.average);

    const topPerformers = performersArray.slice(0, 5);
    const bottomPerformers = performersArray.slice(-5).reverse();

    // 3. Attendance trends (for their department)
    const attendances = await Attendance.find().populate({
      path: "student",
      match: { department: dept },
    }).populate("subject");

    const attendanceBySubject = {};
    attendances.forEach((a) => {
      if (!a.student || !a.subject) return;
      const subName = a.subject.subjectName;
      if (!attendanceBySubject[subName]) {
        attendanceBySubject[subName] = { attended: 0, total: 0 };
      }
      attendanceBySubject[subName].attended += a.lectureAttended;
      attendanceBySubject[subName].total += a.totalLecturesByFaculty;
    });

    const attendanceTrendsData = Object.keys(attendanceBySubject).map((sub) => ({
      name: sub,
      percentage: Math.round(
        (attendanceBySubject[sub].attended / attendanceBySubject[sub].total) * 100 || 0
      ),
    }));

    res.status(200).json({
      success: true,
      result: {
        classAverageData,
        topPerformers,
        bottomPerformers,
        attendanceTrendsData,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getStudentDashboardStats = async (req, res) => {
  try {
    const studentId = req.userId;
    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // 1. Personal performance radar chart (subject-wise)
    const marks = await Marks.find({ student: studentId }).populate("exam");
    const subjects = await Subject.find({ department: student.department, year: student.year });

    const subjectMarks = {};
    marks.forEach((m) => {
      if (!m.exam) return;
      const subCode = m.exam.subjectCode;
      if (!subjectMarks[subCode]) {
        subjectMarks[subCode] = { obtained: 0, total: 0 };
      }
      if (m.marks >= 0) {
        subjectMarks[subCode].obtained += m.marks;
        subjectMarks[subCode].total += m.exam.totalMarks;
      }
    });

    const radarData = subjects.map((sub) => {
      const code = sub.subjectCode;
      const data = subjectMarks[code];
      const percentage = data && data.total > 0 
        ? Math.round((data.obtained / data.total) * 100) 
        : 0;
      return {
        subject: sub.subjectName,
        score: percentage,
        fullMark: 100,
      };
    });

    // 2. Rank in class & Class average comparison
    // Get all tests for this class
    const classTests = await Test.find({
      department: student.department,
      year: student.year,
      section: student.section,
    });
    const classTestIds = classTests.map((t) => t._id);

    // Get all marks for these tests
    const classMarks = await Marks.find({ exam: { $in: classTestIds } }).populate("exam");

    const studentTotalScores = {};
    const testAverages = {};

    classMarks.forEach((m) => {
      if (!m.exam) return;
      const sId = m.student.toString();
      const testName = m.exam.test;

      if (!studentTotalScores[sId]) studentTotalScores[sId] = { total: 0, max: 0 };
      
      if (!testAverages[testName]) testAverages[testName] = { sum: 0, count: 0 };

      if (m.marks >= 0) {
        studentTotalScores[sId].total += m.marks;
        studentTotalScores[sId].max += m.exam.totalMarks;
        
        testAverages[testName].sum += m.marks;
        testAverages[testName].count += 1;
      }
    });

    // Calculate rank based on percentage
    const rankedStudents = Object.keys(studentTotalScores)
      .map((id) => ({
        id,
        percentage: studentTotalScores[id].max > 0 
          ? (studentTotalScores[id].total / studentTotalScores[id].max) * 100 
          : 0,
      }))
      .sort((a, b) => b.percentage - a.percentage);

    const rankIndex = rankedStudents.findIndex((s) => s.id === studentId.toString());
    const rank = rankIndex !== -1 ? rankIndex + 1 : "N/A";

    // Comparison Chart Data
    const comparisonData = classTests.map((test) => {
      const studentMarkObj = marks.find(m => m.exam && m.exam._id.toString() === test._id.toString());
      const studentMark = studentMarkObj && studentMarkObj.marks >= 0 ? studentMarkObj.marks : 0;
      
      const testAvgData = testAverages[test.test];
      const classAverage = testAvgData && testAvgData.count > 0 
        ? Math.round(testAvgData.sum / testAvgData.count) 
        : 0;

      return {
        name: test.test,
        personal: studentMark,
        average: classAverage,
      };
    });

    res.status(200).json({
      success: true,
      result: {
        radarData,
        comparisonData,
        rank,
        totalStudentsInClass: rankedStudents.length,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
