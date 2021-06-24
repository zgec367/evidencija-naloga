import firestore, {firebase} from '@react-native-firebase/firestore';
import {createContext} from 'react';
import auth from '@react-native-firebase/auth';

export const Context = createContext();
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

export const LoginRequest = submitLoading => {
  return {
    type: EMPLOYEE_LOGIN_REQUEST,
    payload: submitLoading,
  };
};

export const LoginSuccess = (data, submitLoading) => {
  return {
    type: EMPLOYEE_LOGIN_SUCCESS,
    payload: data,
    submitLoading: submitLoading,
  };
};

export const LoginFailure = (error, submitLoading) => {
  return {
    type: EMPLOYEE_LOGOUT_FAILURE,
    payload: error,
    submitLoading: submitLoading,
  };
};

export const fetchEmployeesRequest = loadingData => {
  return {
    type: FETCH_EMPLOYEES_REQUEST,
    payload: loadingData,
  };
};

export const fetchEmployeesSuccess = (data, loadingData) => {
  return {
    type: FETCH_EMPLOYEES_SUCCESS,
    payload: data,
    loadingData: loadingData,
  };
};

export const fetchEmployeesFailure = (error, loadingData) => {
  return {
    type: FETCH_EMPLOYEES_FAILURE,
    payload: error,
    loadingData: loadingData,
  };
};
export const fetchEmployees = () => {
  let loadingData = true;
  return dispatch => {
    dispatch(fetchEmployeesRequest(loadingData));
    firestore()
      .collection('Employees')
      .get()
      .then(querySnapshot => {
        loadingData = false;
        const result = querySnapshot.docs.map(e => e._data);
        dispatch(fetchEmployeesSuccess(result, loadingData));
      })
      .catch(error => {
        loadingData = false;
        dispatch(fetchEmployeesFailure(error.message, loadingData));
      });
  };
};
export const login = (email, password) => {
  let submitLoading = true;
  return dispatch => {
    dispatch(LoginRequest(submitLoading));
    auth()
      .signInWithEmailAndPassword(email, password)
      .then(response => {
        submitLoading = false;
        dispatch(LoginSuccess(response.user, submitLoading));
      })
      .catch(error => {
        submitLoading = false;
        dispatch(LoginFailure(error.message, submitLoading));
      });
  };
};
