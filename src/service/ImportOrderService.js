import axiosClient from "../utils/axiosClient";
import axios from "axios";
import authHeader from "./AuthHeader";

const importOrderService = {
  getImportOrderList: (params) => {
    const url = "/import/list";
    return axiosClient.get(url, { params, headers: authHeader() });
  },
  getImportOrderList1: () => {
    const url = "/import/list";
    return axiosClient.get(url, { headers: authHeader() });
  },
  getImportOrderById: (params) => {
    const url = `/import/getOrderDetail`;
    return axiosClient.get(url, { params, headers: authHeader() });
  },

  createImportOrder: (importOrder) => {
    const url = process.env.REACT_APP_API_URL + `/import/createOrder`;
    return axios.post(url, {
      user_Id: importOrder.user_Id,
      manufacturerId: importOrder.manufacturerId,
      warehouseId: importOrder.warehouseId,
      consignmentRequest: importOrder.consignmentRequest,
      headers: authHeader(),
    });
  },
  confirmImportOrder: (params) => {
    const {orderId, confirmBy} = params
    const url = process.env.REACT_APP_API_URL + `/import/confirm?orderId=${orderId}&confirmBy=${confirmBy}`;
    return axiosClient.get(url, { headers: authHeader() });
  },
  cancelImportOrder: (params) => {
    const {orderId, confirmBy} = params
    const url = process.env.REACT_APP_API_URL + `/import/cancel?orderId=${orderId}&confirmBy=${confirmBy}`;
    return axiosClient.get(url, {headers: authHeader() });
  },
  updateImportOrder: (orderId,importOrder) => {
    const url = process.env.REACT_APP_API_URL + `/import/editOrder?orderId=${orderId}`;
    return axios.put(url, importOrder, { headers: authHeader() });
  },
};
export default importOrderService;
