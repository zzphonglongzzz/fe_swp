import axios from "axios";
import axiosClient from "../utils/axiosClient";
import authHeader from "./AuthHeader";

const WarehouseService = {
  getlistWarehouse: () => {
    const url = "/warehouses";
    return axiosClient.get(url, { headers: authHeader() });
  },
  getWarehousebyId: (id) => {
    const url = "/warehouses/getAWarehouse";
    return axiosClient.get(url, { params: { id }, headers: authHeader() });
  },
  createNewWarehouse: (warehouse) => {
    const url = process.env.REACT_APP_API_URL + "/warehouses/addWarehouse";
    return axios.post(
      url,
      {
        id: warehouse.id,
        name: warehouse.name,
        address: warehouse.address,
      },
      { headers: authHeader() }
    );
  },
  updateWarehouse: (warehouse) => {
    const url = process.env.REACT_APP_API_URL + "/warehouses/editWarehouse";
    return axios.put(
      url,
      {
        id: warehouse.id,
        name: warehouse.name,
        address: warehouse.address,
      },
      { headers: authHeader() }
    );
  },
};
export default WarehouseService;
