import {
  SET_ERRORS,
  UPDATE_PASSWORD,
  TEST_RESULT,
  STUDENT_LOGIN,
  ATTENDANCE,
  UPDATE_STUDENT,
  GET_SUBJECT,
  GET_STUDENT_ASSIGNMENTS,
  SUBMIT_ASSIGNMENT,
  GET_STUDENT_DASHBOARD_STATS,
  GET_STUDENT_FEES,
  PAY_STUDENT_FEE,
} from "../actionTypes";
import * as api from "../api";

export const studentSignIn = (formData, navigate) => async (dispatch) => {
  try {
    const { data } = await api.studentSignIn(formData);
    dispatch({ type: STUDENT_LOGIN, data });
    if (data.result.passwordUpdated) navigate("/student/home");
    else navigate("/student/password");
  } catch (error) {
    dispatch({ type: SET_ERRORS, payload: error.response.data });
  }
};

export const studentUpdatePassword =
  (formData, navigate) => async (dispatch) => {
    try {
      const { data } = await api.studentUpdatePassword(formData);
      dispatch({ type: UPDATE_PASSWORD, payload: true });
      alert("Password Updated");
      navigate("/student/home");
    } catch (error) {
      dispatch({ type: SET_ERRORS, payload: error.response.data });
    }
  };

export const updateStudent = (formData) => async (dispatch) => {
  try {
    const { data } = await api.updateStudent(formData);
    dispatch({ type: UPDATE_STUDENT, payload: true });
  } catch (error) {
    dispatch({ type: SET_ERRORS, payload: error.response.data });
  }
};

export const getSubject = (department, year) => async (dispatch) => {
  try {
    const formData = {
      department,
      year,
    };
    const { data } = await api.getSubject(formData);
    dispatch({ type: GET_SUBJECT, payload: data });
  } catch (error) {
    dispatch({ type: SET_ERRORS, payload: error.response.data });
  }
};

export const getTestResult =
  (department, year, section) => async (dispatch) => {
    try {
      const formData = {
        department,
        year,
        section,
      };
      const { data } = await api.getTestResult(formData);
      dispatch({ type: TEST_RESULT, payload: data });
    } catch (error) {
      dispatch({ type: SET_ERRORS, payload: error.response.data });
    }
  };

export const getAttendance =
  (department, year, section) => async (dispatch) => {
    try {
      const formData = {
        department,
        year,
        section,
      };
      const { data } = await api.getAttendance(formData);
      dispatch({ type: ATTENDANCE, payload: data });
    } catch (error) {
      dispatch({ type: SET_ERRORS, payload: error.response.data });
    }
  };

export const getStudentDashboardStats = () => async (dispatch) => {
  try {
    const { data } = await api.getStudentDashboardStats();
    dispatch({
      type: GET_STUDENT_DASHBOARD_STATS,
      payload: data?.result || data,
    });
  } catch (error) {
    dispatch({ type: SET_ERRORS, payload: error.response.data });
  }
};

export const getStudentFees = () => async (dispatch) => {
  try {
    const { data } = await api.getStudentFees();
    dispatch({ type: GET_STUDENT_FEES, payload: data?.result || data });
  } catch (error) {
    dispatch({ type: SET_ERRORS, payload: error.response.data });
  }
};

export const payStudentFee = (payload) => async (dispatch) => {
  try {
    const { data } = await api.payStudentFee(payload);
    dispatch({ type: PAY_STUDENT_FEE, payload: data?.result || data });
    dispatch(getStudentFees());
  } catch (error) {
    dispatch({ type: SET_ERRORS, payload: error.response.data });
  }
};

export const getStudentAssignments = () => async (dispatch) => {
  try {
    const { data } = await api.getStudentAssignments();
    dispatch({ type: GET_STUDENT_ASSIGNMENTS, payload: data });
  } catch (error) {
    dispatch({ type: SET_ERRORS, payload: error.response.data });
  }
};

export const submitAssignment = (assignmentId, formData) => async (dispatch) => {
  try {
    await api.submitAssignment(assignmentId, formData);
    dispatch({ type: SUBMIT_ASSIGNMENT, payload: true });
    dispatch(getStudentAssignments());
    alert("Assignment submitted successfully");
  } catch (error) {
    dispatch({ type: SET_ERRORS, payload: error.response.data });
  }
};
