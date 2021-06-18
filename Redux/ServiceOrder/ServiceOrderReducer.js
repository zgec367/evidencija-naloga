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
      /* const index = state.data.findIndex(data => data.Id !== action.payload); //finding index of the item
      const newArray = [...state.data]; //making a new array
      newArray[index] = action.payload; //changing value in the new array
      console.log(action.index);
*/
      let quote = action.payload;
      let quotes = [...state.data]; //clone the current state
      let index = quotes.findIndex(data => data.Id == quote.Id); //find the index of the quote with the quote id passed
      if (index !== -1) {
        quotes[index] = quote;
      }
      state = Object.assign({}, state, {data: quotes});
      return state;
    /*return {
        ...state, //copying the orignal state
        data: newArray, //reassingning}
      };*/
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

    default:
      return state;
  }
};

export default reducer;
