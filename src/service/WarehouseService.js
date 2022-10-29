import axios from "axios";
import axiosClient from "../utils/axiosClient";

const WarehouseService = {
  getlistWarehouse: () => {
    const url = "/warehouses";
    return axiosClient.get(url);
  },
  getWarehousebyId: (id) => {
    const url = "/getAWarehouse";
    return axiosClient.get(url, { params: { id } });
  },
  createNewWarehouse: (warehouse) => {
    const url = process.env.REACT_APP_API_URL + "/addManufacturer";
    return axios.post(url, {
      id: warehouse.id,
      name: warehouse.name,
      address: warehouse.address,
    });
  },
  updateWarehouse: (warehouse) => {
    const url = process.env.REACT_APP_API_URL + "/editWarehouse";
    return axios.put(url, {
      id: warehouse.id,
      name: warehouse.name,
      address: warehouse.address,
    });
  },
};
export default WarehouseService;
