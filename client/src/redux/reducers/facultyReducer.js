import {
  ADD_TEST,
  ATTENDANCE_MARKED,
  FACULTY_LOGIN,
  GET_TEST,
  LOGOUT,
  MARKS_UPLOADED,
  UPDATE_FACULTY,
  UPDATE_PASSWORD,
  CREATE_ASSIGNMENT,
  GET_FACULTY_ASSIGNMENTS,
  UPDATE_ASSIGNMENT,
  DELETE_ASSIGNMENT,
  GET_ASSIGNMENT_SUBMISSIONS,
  GET_FACULTY_DASHBOARD_STATS,
} from "../actionTypes";

const initialState = {
  authData: null,
  updatedPassword: false,
  updatedFaculty: false,
  testAdded: false,
  marksUploaded: false,
  attendanceUploaded: false,
  tests: [],
  assignments: [],
  assignmentSubmissions: [],
  assignmentCreated: false,
  assignmentUpdated: false,
  assignmentDeleted: false,
  dashboardStats: null,
};

const facultyReducer = (state = initialState, action) => {
  switch (action.type) {
    case FACULTY_LOGIN:
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
    case UPDATE_FACULTY:
      return {
        ...state,
        updatedFaculty: action.payload,
      };
    case ADD_TEST:
      return {
        ...state,
        testAdded: action.payload,
      };
    case GET_TEST:
      return {
        ...state,
        tests: action.payload,
      };
    case MARKS_UPLOADED:
      return {
        ...state,
        marksUploaded: action.payload,
      };
    case ATTENDANCE_MARKED:
      return {
        ...state,
        attendanceUploaded: action.payload,
      };
    case CREATE_ASSIGNMENT:
      return {
        ...state,
        assignmentCreated: action.payload,
      };
    case GET_FACULTY_ASSIGNMENTS:
      return {
        ...state,
        assignments: action.payload,
      };
    case UPDATE_ASSIGNMENT:
      return {
        ...state,
        assignmentUpdated: action.payload,
      };
    case DELETE_ASSIGNMENT:
      return {
        ...state,
        assignmentDeleted: action.payload,
      };
    case GET_ASSIGNMENT_SUBMISSIONS:
      return {
        ...state,
        assignmentSubmissions: action.payload,
      };
    case GET_FACULTY_DASHBOARD_STATS:
      return {
        ...state,
        dashboardStats: action.payload,
      };

    default:
      return state;
  }
};

export default facultyReducer;
