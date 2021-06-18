import firestore, {firebase} from '@react-native-firebase/firestore';
import {createContext} from 'react';
import moment from 'moment';

export const Context = createContext();
import {
  FETCH_IN_PROGRESS_SERVICE_ORDERS_REQUEST,
  FETCH_IN_PROGRESS_SERVICE_ORDERS_SUCCESS,
  FETCH_IN_PROGRESS_SERVICE_ORDERS_FAILURE,
  FETCH_FINISHED_SERVICE_ORDERS_REQUEST,
  FETCH_FINISHED_SERVICE_ORDERS_SUCCESS,
  FETCH_FINISHED_SERVICE_ORDERS_FAILURE,
  ADD_SERVICE_ORDER_REQUEST,
  ADD_SERVICE_ORDER_SUCCESS,
  ADD_SERVICE_ORDER_FAILURE,
  UPDATE_SERVICE_ORDER_REQUEST,
  UPDATE_SERVICE_ORDER_SUCCESS,
  UPDATE_SERVICE_ORDER_FAILURE,
  FINISH_SERVICE_ORDER_REQUEST,
  FINISH_SERVICE_ORDER_SUCCESS,
  FINISH_SERVICE_ORDER_FAILURE,
  TAKE_PHOTO_REQUEST,
  TAKE_PHOTO_SUCCESS,
  TAKE_PHOTO_FAILURE,
  PRINT_SERVICE_ORDER_REQUEST,
  PRINT_SERVICE_ORDER_SUCCESS,
  PRINT_SERVICE_ORDER_FAILURE,
} from '../ServiceOrder/ServiceOrderTypes';
import {string} from 'yup/lib/locale';

export const fetchInProgressOrdersRequest = loadingData => {
  return {
    type: FETCH_IN_PROGRESS_SERVICE_ORDERS_REQUEST,
    payload: loadingData,
  };
};

export const fetchInProgressOrdersSuccess = (data, loadingData) => {
  return {
    type: FETCH_IN_PROGRESS_SERVICE_ORDERS_SUCCESS,
    payload: data,
    loadingData: loadingData,
  };
};

export const fetchInProgressOrdersFailure = (error, loadingData) => {
  return {
    type: FETCH_IN_PROGRESS_SERVICE_ORDERS_FAILURE,
    payload: error,
    loadingData: loadingData,
  };
};

export const addServiceOrderRequest = submitLoading => {
  return {
    type: ADD_SERVICE_ORDER_REQUEST,
    payload: submitLoading,
  };
};

export const addServiceOrderSuccess = (data, submitLoading) => {
  return {
    type: ADD_SERVICE_ORDER_SUCCESS,
    payload: data,
    submitLoading: submitLoading,
  };
};

export const addServiceOrderFailure = (error, submitLoading) => {
  return {
    type: ADD_SERVICE_ORDER_FAILURE,
    payload: error,
    submitLoading: submitLoading,
  };
};

export const editServiceOrderRequest = submitLoading => {
  return {
    type: UPDATE_SERVICE_ORDER_REQUEST,
    payload: submitLoading,
  };
};

export const editServiceOrderSuccess = (submitLoading, successStatus, data) => {
  return {
    type: UPDATE_SERVICE_ORDER_SUCCESS,
    payload: data,
    submitLoading: submitLoading,
    success: successStatus,
  };
};

export const editServiceOrderFailure = (error, submitLoading) => {
  return {
    type: UPDATE_SERVICE_ORDER_FAILURE,
    payload: error,
    submitLoading: submitLoading,
  };
};

export const printServiceOrderRequest = loading => {
  return {
    type: PRINT_SERVICE_ORDER_REQUEST,
    payload: loading,
  };
};

export const printServiceOrderSuccess = (data, loading) => {
  return {
    type: PRINT_SERVICE_ORDER_SUCCESS,
    payload: data,
    loading: loading,
  };
};

export const printServiceOrderFailure = (error, loading) => {
  return {
    type: PRINT_SERVICE_ORDER_FAILURE,
    payload: error,
    loading: loading,
  };
};

export const takePhotoRequest = loading => {
  return {
    type: TAKE_PHOTO_REQUEST,
    payload: loading,
  };
};

export const takePhotoSuccess = (data, loading) => {
  return {
    type: TAKE_PHOTO_SUCCESS,
    payload: data,
    loading: loading,
  };
};

export const takePhotoFailure = (error, loading) => {
  return {
    type: TAKE_PHOTO_FAILURE,
    payload: error,
    loading: loading,
  };
};

export const addServiceOrder = (serviceOrder, navigation) => {
  let submitLoading = true;
  return dispatch => {
    dispatch(addServiceOrderRequest(submitLoading));
    firestore()
      .collection('ServiceOrders')
      .add(serviceOrder)
      .then(snapshot => {
        serviceOrder.Id = snapshot.id;
        if (serviceOrder.Photo) {
          const fileExtension = serviceOrder.Photo.split('.').pop();
          const fileName = `${snapshot.id}.${fileExtension}`;
          const storageRef = firebase
            .storage()
            .ref(`serviceorders/images/${fileName}`);
          storageRef.putFile(serviceOrder.Photo).on(
            firebase.storage.TaskEvent.STATE_CHANGED,
            snapshot => {
              if (snapshot.state === firebase.storage.TaskState.SUCCESS) {
                console.log('Success');
              }
            },
            error => {
              unsubscribe();
              submitLoading = false;
              const errorMsg = error.message;
              dispatch(addServiceOrderFailure(errorMsg, submitLoading));
            },
            () => {
              storageRef.getDownloadURL().then(downloadUrl => {
                submitLoading = false;
                console.log('file: ' + downloadUrl);
                serviceOrder.Photo = downloadUrl;
                snapshot.set(serviceOrder);
                dispatch(addServiceOrderSuccess(serviceOrder, submitLoading));
                navigation.goBack();
              });
            },
          );
        } else {
          submitLoading = false;
          snapshot.set(serviceOrder);
          dispatch(addServiceOrderSuccess(serviceOrder, submitLoading));
          navigation.goBack();
        }
      })
      .catch(error => {
        submitLoading = false;
        const errorMsg = error.message;
        dispatch(addServiceOrderFailure(errorMsg, submitLoading));
      });
  };
};

export const fetchInProgressOrder = () => {
  let loadingData = true;
  let serviceOrderList = [];
  return dispatch => {
    dispatch(fetchInProgressOrdersRequest(loadingData));
    firestore()
      .collection('ServiceOrders')
      .orderBy('OrderDate', 'desc')
      .get()
      .then(querySnapshot => {
        querySnapshot.docs.map(e => {
          serviceOrderList.push(e._data);
        });
        loadingData = false;
        const data = serviceOrderList;
        dispatch(fetchInProgressOrdersSuccess(data, loadingData));
      })
      .catch(error => {
        loadingData = false;
        const errorMsg = error.message;
        dispatch(fetchInProgressOrdersFailure(errorMsg, loadingData));
      });
  };
};

export const editServiceOrder = (serviceOrder, navigation) => {
  let submitLoading = true;
  return dispatch => {
    dispatch(editServiceOrderRequest(submitLoading));
    firestore()
      .collection('ServiceOrders')
      .doc(serviceOrder.Id)
      .update({
        Customer: {
          Name: serviceOrder.Customer.Name,
          PhoneNumber: serviceOrder.Customer.PhoneNumber,
        },
        Article: serviceOrder.Article,
        Description: serviceOrder.Description,
        WarrantyPeriod: serviceOrder.WarrantyPeriod,
        EssentialData: serviceOrder.EssentialData,
        PerformedServicesList: serviceOrder.PerformedServicesList,
        TotalPrice: serviceOrder.TotalPrice,
      })
      .then(snapshot => {
        submitLoading = false;
        let successStatus = true;
        console.log(successStatus);
        dispatch(
          editServiceOrderSuccess(submitLoading, successStatus, serviceOrder),
        );
        navigation.goBack();
      })

      .catch(error => {
        submitLoading = false;
        dispatch(editServiceOrderFailure(submitLoading));
        console.log('error je:' + error.message);
      });
  };
};
