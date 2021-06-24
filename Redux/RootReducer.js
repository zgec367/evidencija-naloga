import { combineReducers } from "redux";
import serviceOrderReducer from "./ServiceOrder/ServiceOrderReducer";
import employeeReducer from "./Employee/EmployeeReducer";

const rootReducer = combineReducers({
  serviceOrdersData: serviceOrderReducer,
  employeesData: employeeReducer,
});

export default rootReducer;
