import { dateDifference, parseISO } from "../../utils";
import {
  GET,
  POST,
  FETCH_VEHICLES,
  GET_VEHICLES,
  SEARCH_VEHICLE,
  CLEAR_SEARCH,
  ADD_VEHICLES,
  DELETE_VEHICLES,
  GET_SUMMARY
} from "../constants";
import apiRequest from "../requests";

export const getVehicles = () => async (dispatch) => {
  const res = await apiRequest(GET, "vehicles");
  dispatch({ type: GET_VEHICLES, payload: res.data.vehicles });
};

export const updateVehicles = (vehicle_id, to_dept_id) => async (dispatch) => {
  await apiRequest(GET, `vehicles/${vehicle_id}/${to_dept_id}`);

  dispatch({ type: FETCH_VEHICLES });

  setTimeout(async () => {
    const res = await apiRequest(GET, "vehicles");
    dispatch({ type: GET_VEHICLES, payload: res.data.vehicles });
  }, 1000);
};

export const searchVehicles = (data, searchValue) => async (dispatch) => {
  const searchedValue = searchValue.toUpperCase();
  const result = data.filter(
    (ele) =>
      ele.stock.toUpperCase().includes(searchedValue) ||
      ele.make.toUpperCase().includes(searchedValue) ||
      ele.model.toUpperCase().includes(searchedValue)
  );
  if (searchedValue) dispatch({ type: SEARCH_VEHICLE, payload: result });
  else dispatch({ type: CLEAR_SEARCH });
};

export const addVehicles = (data) => async (dispatch) => {
  const payload = {
    ...data,
    date_in: parseISO(data.date_in),
  };
  await apiRequest(POST, `vehicles`, payload);
  const res = await apiRequest(GET, `vehicles`);
  dispatch({ type: ADD_VEHICLES, payload: res.data.vehicles });
};

export const deleteVehicles = (id) => async (dispatch) => {
  await apiRequest(GET, `vehicles/${id}`);
  const res = await apiRequest(GET, `vehicles`);
  dispatch({ type: DELETE_VEHICLES, payload: res.data.vehicles });
};

export const getSummary = (depts, vehicles) => async (dispatch) => {
  let result = [];

  for(let i=0; i<depts.length; i++) {
    result.push({
      dept_id: depts[i].dept_id,
      name: depts[i].name,
      days: getCombineCounts(vehicles, depts[i].dept_id)
    })
  }

  dispatch({ type: GET_SUMMARY, payload: result })
};

export const getCombineCounts = (vehicles, dept_id) => {
  const result = vehicles.reduce((res, ele) => {
    if (ele.dept_id === dept_id) res.push(dateDifference(ele.date_in));
    return res;
  }, []);
  const lengthOfResult = result.length;
  const average = result.reduce((a, b) => a + b, 0) / lengthOfResult;
  const value = average % 1 !== 0 ? average.toFixed(1) : average;
  if(!isNaN(value)) return value;
  else return 0;
};
