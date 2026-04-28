import {
  SET_ERRORS,
  FACULTY_LOGIN,
  UPDATE_PASSWORD,
  UPDATE_FACULTY,
  ADD_TEST,
  GET_TEST,
  GET_STUDENT,
  MARKS_UPLOADED,
  ATTENDANCE_MARKED,
  CREATE_ASSIGNMENT,
  GET_FACULTY_ASSIGNMENTS,
  UPDATE_ASSIGNMENT,
  DELETE_ASSIGNMENT,
  GET_ASSIGNMENT_SUBMISSIONS,
} from "../actionTypes";
import * as api from "../api";

export const facultySignIn = (formData, navigate) => async (dispatch) => {
  try {
    const { data } = await api.facultySignIn(formData);
    dispatch({ type: FACULTY_LOGIN, data });
    if (data.result.passwordUpdated) navigate("/faculty/home");
    else navigate("/faculty/password");
  } catch (error) {
    dispatch({ type: SET_ERRORS, payload: error.response.data });
  }
};

export const facultyUpdatePassword =
  (formData, navigate) => async (dispatch) => {
    try {
      const { data } = await api.facultyUpdatePassword(formData);
      dispatch({ type: UPDATE_PASSWORD, payload: true });
      alert("Password Updated");
      navigate("/faculty/home");
    } catch (error) {
      dispatch({ type: SET_ERRORS, payload: error.response.data });
    }
  };

export const updateFaculty = (formData) => async (dispatch) => {
  try {
    const { data } = await api.updateFaculty(formData);
    dispatch({ type: UPDATE_FACULTY, payload: true });
  } catch (error) {
    dispatch({ type: SET_ERRORS, payload: error.response.data });
  }
};

export const createTest = (formData) => async (dispatch) => {
  try {
    const { data } = await api.createTest(formData);
    alert("Test Created Successfully");

    dispatch({ type: ADD_TEST, payload: true });
  } catch (error) {
    dispatch({ type: SET_ERRORS, payload: error.response.data });
  }
};

export const getTest = (formData) => async (dispatch) => {
  try {
    const { data } = await api.getTest(formData);
    dispatch({ type: GET_TEST, payload: data });
  } catch (error) {
    dispatch({ type: SET_ERRORS, payload: error.response.data });
  }
};

export const getStudent = (formData) => async (dispatch) => {
  try {
    const { data } = await api.getMarksStudent(formData);
    dispatch({ type: GET_STUDENT, payload: data });
  } catch (error) {
    dispatch({ type: SET_ERRORS, payload: error.response.data });
  }
};

export const uploadMark =
  (marks, department, section, year, test) => async (dispatch) => {
    try {
      const formData = {
        marks,
        department,
        section,
        year,
        test,
      };
      const { data } = await api.uploadMarks(formData);
      alert("Marks Uploaded Successfully");
      dispatch({ type: MARKS_UPLOADED, payload: true });
    } catch (error) {
      dispatch({ type: SET_ERRORS, payload: error.response.data });
    }
  };

export const markAttendance =
  (checkedValue, subjectName, department, year, section) =>
    async (dispatch) => {
      try {
        const formData = {
          selectedStudents: checkedValue,
          subjectName,
          department,
          year,
          section,
        };
        const { data } = await api.markAttendance(formData);
        alert("Attendance Marked Successfully");
        dispatch({ type: ATTENDANCE_MARKED, payload: true });
      } catch (error) {
        dispatch({ type: SET_ERRORS, payload: error.response.data });
      }
    };

export const createAssignment = (formData) => async (dispatch) => {
  try {
    await api.createAssignment(formData);
    dispatch({ type: CREATE_ASSIGNMENT, payload: true });
    dispatch(getFacultyAssignments());
    alert("Assignment published successfully");
  } catch (error) {
    dispatch({ type: SET_ERRORS, payload: error.response.data });
  }
};

export const getFacultyAssignments = () => async (dispatch) => {
  try {
    const { data } = await api.getFacultyAssignments();
    dispatch({ type: GET_FACULTY_ASSIGNMENTS, payload: data });
  } catch (error) {
    dispatch({ type: SET_ERRORS, payload: error.response.data });
  }
};

export const updateAssignment = (assignmentId, formData) => async (dispatch) => {
  try {
    await api.updateAssignment(assignmentId, formData);
    dispatch({ type: UPDATE_ASSIGNMENT, payload: true });
    dispatch(getFacultyAssignments());
    alert("Assignment updated successfully");
  } catch (error) {
    dispatch({ type: SET_ERRORS, payload: error.response.data });
  }
};

export const deleteAssignment = (assignmentId) => async (dispatch) => {
  try {
    await api.deleteAssignment(assignmentId);
    dispatch({ type: DELETE_ASSIGNMENT, payload: true });
    dispatch(getFacultyAssignments());
    alert("Assignment deleted");
  } catch (error) {
    dispatch({ type: SET_ERRORS, payload: error.response.data });
  }
};

export const getAssignmentSubmissions = (assignmentId) => async (dispatch) => {
  try {
    const { data } = await api.getAssignmentSubmissions(assignmentId);
    dispatch({ type: GET_ASSIGNMENT_SUBMISSIONS, payload: data });
  } catch (error) {
    dispatch({ type: SET_ERRORS, payload: error.response.data });
  }
};
