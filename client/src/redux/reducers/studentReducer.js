import {
  LOGOUT,
  STUDENT_LOGIN,
  UPDATE_STUDENT,
  UPDATE_PASSWORD,
  TEST_RESULT,
  ATTENDANCE,
  GET_STUDENT_ASSIGNMENTS,
  SUBMIT_ASSIGNMENT,
  GET_STUDENT_DASHBOARD_STATS,
  GET_STUDENT_FEES,
  PAY_STUDENT_FEE,
} from "../actionTypes";

const initialState = {
  authData: null,
  updatedPassword: false,
  updatedStudent: false,
  testAdded: false,
  marksUploaded: false,
  attendanceUploaded: false,
  testResult: [],
  tests: [],
  attendance: [],
  assignments: [],
  assignmentSubmitted: false,
  dashboardStats: null,
  fees: [],
  feeSummary: null,
  feePaymentResult: null,
};

const studentReducer = (state = initialState, action) => {
  switch (action.type) {
    case STUDENT_LOGIN:
      localStorage.setItem("user", JSON.stringify({ ...action?.data }));
      return { ...state, authData: action?.data };
    case LOGOUT:
      localStorage.clear();
      return { ...state, authData: null };
    case UPDATE_PASSWORD:
      return {
        ...state,
        updatedPassword: action.payload,
      };
    case UPDATE_STUDENT:
      return {
        ...state,
        updatedStudent: action.payload,
      };
    case TEST_RESULT:
      return {
        ...state,
        testResult: action.payload,
      };
    case ATTENDANCE:
      return {
        ...state,
        attendance: action.payload,
      };
    case GET_STUDENT_ASSIGNMENTS:
      return {
        ...state,
        assignments: action.payload,
      };
    case SUBMIT_ASSIGNMENT:
      return {
        ...state,
        assignmentSubmitted: action.payload,
      };
    case GET_STUDENT_DASHBOARD_STATS:
      return {
        ...state,
        dashboardStats: action.payload,
      };
    case GET_STUDENT_FEES:
      return {
        ...state,
        fees: action.payload?.fees || [],
        feeSummary: action.payload?.totals || null,
      };
    case PAY_STUDENT_FEE:
      return {
        ...state,
        feePaymentResult: action.payload,
      };

    default:
      return state;
  }
};

export default studentReducer;
