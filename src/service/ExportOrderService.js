import axiosClient from "../utils/axiosClient";
import axios from "axios";
import authHeader from "./AuthHeader";

const ExportOrderService = {
  createExportOrder: (exportOrder) => {
    const url = process.env.REACT_APP_API_URL + `/export/create-exportOrder`;
    // const url = process.env.REACT_APP_API_URL + '/export-order/create';
    // console.log(exportOrder);
    return axios.post(url, exportOrder, { headers: authHeader() });
  },
  confirmExportOrder: (params) => {
    const { orderId, confirmBy } = params;
    const url =
      process.env.REACT_APP_API_URL +
      `/export/confirm?orderId=${orderId}&confirmBy=${confirmBy}`;
    return axiosClient.get(url, { headers: authHeader() });
  },
  cancelExportOrder: (params) => {
    const { orderId, confirmBy } = params;
    const url =
      process.env.REACT_APP_API_URL +
      `/export/cancel?orderId=${orderId}&confirmBy=${confirmBy}`;
    return axiosClient.get(url, { headers: authHeader() });
  },
  updateExportOrder: (exportOrder) => {
    const url = process.env.REACT_APP_API_URL + `/export/editOrder`;
    return axios.put(url, exportOrder, { headers: authHeader() });
  },
  getListConsignmentOfProductInStock: (id) => {
    const url = `/export/export-product?id=${id}`;
    return axiosClient.get(url, { headers: authHeader() });
  },
  getExportOrderList: (params) => {
    const url = '/export/list';
    return axiosClient.get(url, { params, headers: authHeader() });
  },
  getExportOrderById: (orderId) => {
    const url = `/export/getOrderDetail?orderId=${orderId}`;
    return axiosClient.get(url, { headers: authHeader() });
  },
  getReturnOrderList: (params) => {
    const url = '/return-order/list';
    return axiosClient.get(url, { params, headers: authHeader() });
  },

  getReturnOrderDetail: (params) => {
    console.log(params)
    const url = `/return-order/detail`;
    return axiosClient.get(url, { params, headers: authHeader() });
  },

  createReturnOrder: (params) => {
    const {returnOrder, exportOrderId} = params
    const url = process.env.REACT_APP_API_URL + `/return-order/return/${exportOrderId}`;
    return axios.post(url, returnOrder, { headers: authHeader() });
  }
};
export default ExportOrderService;
