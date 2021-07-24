import firestore, {firebase} from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import {createContext} from 'react';
import {ToastAndroid, Alert} from 'react-native';
import RNPrint from 'react-native-print';
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

///
export const finishServiceOrderRequest = submitLoading => {
  return {
    type: FINISH_SERVICE_ORDER_REQUEST,
    payload: submitLoading,
  };
};

export const finishServiceOrderSuccess = (
  submitLoading,
  successStatus,
  data,
) => {
  return {
    type: FINISH_SERVICE_ORDER_SUCCESS,
    payload: data,
    submitLoading: submitLoading,
    success: successStatus,
  };
};

export const finishServiceOrderFailure = (error, submitLoading) => {
  return {
    type: FINISH_SERVICE_ORDER_FAILURE,
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
  console.log('u funckiji' + serviceOrder.Id);
  let submitLoading = true;
  return dispatch => {
    dispatch(addServiceOrderRequest(submitLoading));
    firestore()
      .collection('ServiceOrders')
      .add(serviceOrder)
      .then(snapshot => {
        serviceOrder.Id = snapshot.id;
        serviceOrder.OrderDate = firebase.firestore.Timestamp.fromDate(
          new Date(),
        );

        if (serviceOrder.Photo) {
          const fileExtension = serviceOrder.Photo.split('.').pop();
          const fileName = `${snapshot.id}.${fileExtension}`;
          const storageRef = storage().ref(`serviceorders/images/${fileName}`);
          storageRef.putFile(serviceOrder.Photo).on(
            firebase.storage.TaskEvent.STATE_CHANGED,
            snapshot => {
              if (snapshot.state === firebase.storage.TaskState.SUCCESS) {
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
                serviceOrder.Photo = downloadUrl;
                snapshot.set(serviceOrder);
                dispatch(addServiceOrderSuccess(serviceOrder, submitLoading));
                ToastAndroid.showWithGravityAndOffset(
                  'Uspješno ste dodali servisni nalog',
                  ToastAndroid.SHORT,
                  ToastAndroid.BOTTOM,
                  0,
                  100,
                );
                navigation.goBack();
                printPDF(serviceOrder);
              });
            },
          );
        } else {
          submitLoading = false;
          snapshot.set(serviceOrder);
          dispatch(addServiceOrderSuccess(serviceOrder, submitLoading));
          ToastAndroid.showWithGravityAndOffset(
            'Uspješno ste dodali servisni nalog',
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM,
            0,
            100,
          );
          navigation.goBack();
          printPDF(serviceOrder);
        }
      })
      .catch(error => {
        submitLoading = false;
        const errorMsg = error.message;
        dispatch(addServiceOrderFailure(errorMsg, submitLoading));
        console.log('error je:' + errorMsg);
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

          console.log(e._data.Done);
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
        Done: serviceOrder.Done,
      })
      .then(() => {
        submitLoading = false;
        let successStatus = true;
        ToastAndroid.showWithGravityAndOffset(
          'Uspješno ste ažurirali servisni nalog',
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM,
          0,
          100,
        );
        dispatch(
          editServiceOrderSuccess(submitLoading, successStatus, serviceOrder),
        );
        navigation.goBack();
      })

      .catch(error => {
        submitLoading = false;
        dispatch(editServiceOrderFailure(submitLoading));
      });
  };
};

///////////
export const finishServiceOrder = (serviceOrder, navigation) => {
  let submitLoading = true;
  return dispatch => {
    dispatch(finishServiceOrderRequest(submitLoading));
    firestore()
      .collection('ServiceOrders')
      .doc(serviceOrder.Id)
      .update({
        PerformedServicesList: serviceOrder.PerformedServicesList,
        TotalPrice: serviceOrder.TotalPrice,
        Done: serviceOrder.Done,
      })
      .then(() => {
        submitLoading = false;
        let successStatus = true;
        dispatch(
          finishServiceOrderSuccess(submitLoading, successStatus, serviceOrder),
        );
        ToastAndroid.showWithGravityAndOffset(
          'Uspješno ste izvršili servisni nalog',
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM,
          0,
          100,
        );
        navigation.goBack();
      })
      .catch(error => {
        submitLoading = false;
        dispatch(finishServiceOrderFailure(submitLoading));
      });
  };
};

const printPDF = async serviceOrder => {
  Alert.alert(
    'Printanje naloga',
    'Želite li isprintati kreirani nalog?',
    [
      {
        text: 'Odustani',
        style: 'cancel',
      },
      {
        text: 'Printaj',
        onPress: () => {
          RNPrint.print({
            html: `
                <style>
                td, th {
                  border: 1px solid black;
                  text-align: left;
                  font-size: 35px;
                  margin:0px;
                }
                h2 {
                  font-size:35px;
                  text-align: center;
                }
                table{
                  width:100%;
                }
                .service{
                  width:80%;
                }
              .description{
                height:100px;
              }
              .order-info{
                font-size:35px;
                margin-top:100px;
              }
              .order-price{
                font-size:40px;
                font-weight:500;
                float:right;
                margin-top:20px;
              }
              .customer-line{
                margin-top:50px;
              }
              .received{
                margin-top:100px;
                float:right;
                font-size:35px;
              }
                </style>
                <h2>Servisni nalog br.: ${moment(
                  serviceOrder.OrderDate,
                ).year()}/${serviceOrder.ServiceOrderNumber}</h2>
                <table>
                <tr>
                  <td>Kupac:${serviceOrder.Customer.Name}</td>
                  <td>Tel./Mob.:${serviceOrder.Customer.PhoneNumber}</td>
                </tr>
                </table>
                <h2>Za servis:</h2>
                <table>
                <tr>
                  <td>Artikl:${serviceOrder.Article}</td>
                  
                </tr>
                <tr>
                <td class="service">Garantni rok:${
                  serviceOrder.WarrantyPeriod ? 'Da' : 'Ne'
                }</td>
                </tr>
                <tr>
                <td class="service">Podaci bitni:${
                  serviceOrder.EssentialData ? 'Da' : 'Ne'
                }</td>
                </tr>
                </table>
                <table>
                <tr class="description">
                <td>Opis:</td>
                <td>${serviceOrder.Description}</td>                          
                </tr>                      
                </table>                      
                <div class="order-info"> <div>Datum i vrijeme naloga: ${
                  moment(serviceOrder.OrderDate).format('DD.MM.yyyy. u ') +
                  serviceOrder.OrderTime
                }
                </div>
                <div class="received"> <div>Zaprimio:</div> <div>${
                  serviceOrder.Received
                }</div>
                </div>                      
                <div class="order-info">Kupac</div>
                <div class="customer-line">_______________________</div>                        
                </div>                      
            `,
          });
        },
      },
    ],
    {cancelable: false},
  );
};
