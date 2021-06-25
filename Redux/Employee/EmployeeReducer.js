import {
  EMPLOYEE_LOGIN_REQUEST,
  EMPLOYEE_LOGIN_SUCCESS,
  EMPLOYEE_LOGIN_FAILURE,
  EMPLOYEE_LOGOUT_REQUEST,
  EMPLOYEE_LOGOUT_SUCCESS,
  EMPLOYEE_LOGOUT_FAILURE,
  FETCH_EMPLOYEES_REQUEST,
  FETCH_EMPLOYEES_SUCCESS,
  FETCH_EMPLOYEES_FAILURE,
} from '../Employee/EmployeeTypes';

const initialState = {
  employees: [],
  employee: {},
  submitLoading: false,
  errorMsg: '',
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_EMPLOYEES_REQUEST:
      return {
        ...state,
        loadingData: action.payload,
      };
    case FETCH_EMPLOYEES_SUCCESS:
      return {
        ...state,
        employees: action.payload,
        loadingData: action.loadingData,
      };

    case FETCH_EMPLOYEES_FAILURE:
      return {
        ...state,
        loadingData: action.loadingData,
        employees: [],
        errorMsg: action.payload,
        error: true,
      };
    case EMPLOYEE_LOGIN_REQUEST:
      return {
        ...state,
        submitLoading: action.payload,
      };
    case EMPLOYEE_LOGIN_SUCCESS:
      return {
        ...state,
        employee: action.payload,
        submitLoading: action.submitLoading,
      };
    case EMPLOYEE_LOGIN_FAILURE:
      return {
        ...state,
        errorMsg: action.payload,
        error: true,
        submitLoading: action.submitLoading,
      };
    case EMPLOYEE_LOGOUT_REQUEST:
      return {
        ...state,
        loading: action.loading,
      };
    case EMPLOYEE_LOGOUT_SUCCESS:
      return {
        ...state,
        employee: action.payload,
        loading: action.loading,
      };
    case EMPLOYEE_LOGOUT_FAILURE:
      return {
        ...state,
        errorMsg: action.payload,
        error: true,
        employee: {},
        loading: action.loading,
      };

    default:
      return state;
  }
};

export default reducer;
