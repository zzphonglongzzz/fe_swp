import axiosClient from "../utils/axiosClient";
import axios from "axios";
import authHeader from "./AuthHeader";

const ExportOrderService = {
  createExportOrder: (exportOrder) => {
    const url = process.env.REACT_APP_API_URL + `/export/create-exportOrder`;
    return axios.post(url, exportOrder, { headers: authHeader() });
  },
  confirmExportOrder: (params) => {
    const { orderId, confirmBy } = params;
    const url = process.env.REACT_APP_API_URL + `/export/confirm?orderId=${orderId}&confirmBy=${confirmBy}`;
    return axios.put(url, { headers: authHeader() });
  },
  cancelExportOrder: (params) => {
    const { orderId, confirmBy } = params;
    const url = process.env.REACT_APP_API_URL + `/export/cancel?orderId=${orderId}&confirmBy=${confirmBy}`;
    return axios.put(url, { headers: authHeader() });
  },
  updateExportOrder: (orderId,exportOrder) => {
    const url = process.env.REACT_APP_API_URL + `/export/editOrder?orderId=${orderId}`;
    return axios.put(url, exportOrder, { headers: authHeader() });
  },
  getListProductInStock: () => {
    const url = '/export/listProduct';
    return axiosClient.get(url, { headers: authHeader() });
  },
  getListConsignmentOfProductInStock: (id) => {
    const url = `/export/export-product?id=${id}`;
    return axiosClient.get(url, { headers: authHeader() });
  },
  getExportOrderList: (params) => {
    const url = '/export/list';
    return axiosClient.get(url, { params, headers: authHeader() });
  },
  getExportOrderById: (params) => {
    const url = `/export/getOrderDetail`;
    return axiosClient.get(url, {params, headers: authHeader() });
  },
  getReturnOrderList: (params) => {
    const url = '/return/list';
    return axiosClient.get(url, { params, headers: authHeader() });
  },
  getReturnOrderDetail: (params) => {
    const url = `/return/getOrderDetail`;
    return axiosClient.get(url, { params, headers: authHeader() });
  },
  createReturnOrder: (orderId,orderCode,confirmBy,description,params) => {
    const url = process.env.REACT_APP_API_URL + `/return/createReturnOrder?orderId=${orderId}&orderCode=${orderCode}&confirmBy=${confirmBy}&description=${description}`;
    return axios.post(url, params, { headers: authHeader() });
  },
  deliveredExportOrder: (orderId)=>{
    const url = process.env.REACT_APP_API_URL +`/export/exported?orderId=${orderId}`;
    return axios.post(url, { headers: authHeader() });
  },
  getOrderDetailForCancelDeliveredOrder:(orderId) =>{
    const url = `/export/getOrderDetailForCancelExportedExportOrder?orderId=${orderId}`;
    return axiosClient.get(url, { headers: authHeader() });
  },
  cancelDeliveredOrder:(orderId,params) =>{
    const url = process.env.REACT_APP_API_URL +`/export/cancelExportedExportOrder?orderId=${orderId}`;
    return axios.put(url, params, { headers: authHeader() });
  },
  getDetailCancelDeliveredOrder:(orderId) =>{
    const url = `/export/getDetailCancelExportedExportOrder?orderId=${orderId}`;
    return axiosClient.get(url, { headers: authHeader() });
  }
};
export default ExportOrderService;
