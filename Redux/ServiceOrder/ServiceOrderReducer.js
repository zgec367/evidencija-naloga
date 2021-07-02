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
  FPRINT_SERVICE_ORDER_FAILURE,
} from '../ServiceOrder/ServiceOrderTypes';

const initialState = {
  data: [],
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_IN_PROGRESS_SERVICE_ORDERS_REQUEST:
      return {
        ...state,
        loadingData: action.payload,
      };
    case FETCH_IN_PROGRESS_SERVICE_ORDERS_SUCCESS:
      return {
        ...state,
        data: action.payload,
        loadingData: action.loadingData,
      };

    case FETCH_IN_PROGRESS_SERVICE_ORDERS_FAILURE:
      return {
        loadingData: action.loadingData,
        data: [],
        errorMsg: action.payload,
        error: true,
      };
    case ADD_SERVICE_ORDER_REQUEST:
      return {
        ...state,
        submitLoading: action.payload,
      };
    case ADD_SERVICE_ORDER_SUCCESS:
      return {
        ...state,
        data: [...state.data, action.payload],
        submitLoading: action.submitLoading,
      };
    case ADD_SERVICE_ORDER_FAILURE:
      return {
        ...state,
        errorMsg: action.payload,
        error: true,
        submitLoading: action.submitLoading,
      };
    case UPDATE_SERVICE_ORDER_SUCCESS:
      let serviceOrder = action.payload;
      let serviceOrders = [...state.data];
      let index = serviceOrders.findIndex(data => data.Id == serviceOrder.Id);
      if (index !== -1) {
        serviceOrders[index] = serviceOrder;
      }
      state = Object.assign({}, state, {
        data: serviceOrders,
        successStatus: action.success,
      });
      return state;

    case UPDATE_SERVICE_ORDER_REQUEST:
      return {
        ...state,
        loading: action.loading,
      };
    case UPDATE_SERVICE_ORDER_FAILURE:
      return {
        ...state,
        errorMsg: action.payload,
        error: true,
        loading: action.loading,
        successStatus: false,
      };
    case FINISH_SERVICE_ORDER_SUCCESS:
      let order = action.payload;
      let orders = [...state.data];
      let i = orders.findIndex(data => data.Id == order.Id);
      if (i !== -1) {
        orders[i] = order;
      }
      state = Object.assign({}, state, {
        data: orders,
        successStatus: action.success,
      });
      return state;

    case FINISH_SERVICE_ORDER_REQUEST:
      return {
        ...state,
        loading: action.loading,
      };
    case FINISH_SERVICE_ORDER_FAILURE:
      return {
        ...state,
        errorMsg: action.payload,
        error: true,
        loading: action.loading,
        successStatus: false,
      };
    default:
      return state;
  }
};

export default reducer;
