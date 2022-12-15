import axiosClient from "../utils/axiosClient";
import authHeader from "./AuthHeader";

const DashboardService = {
  getTotalProductInWarehouse: () => {
    const url = `/home/totalProductInWarehouse`;
    return axiosClient.get(url, {headers: authHeader() });
  },
  getTotalImportOrders: () => {
    const url = `/home/totalImportOrders`;
    return axiosClient.get(url, {headers: authHeader() });
  },
  getTotalExportOrders: () => {
    const url = `/home/totalExportOrders`;
    return axiosClient.get(url, {headers: authHeader() });
  },
  getProuctSale: () => {
    const url = `/home/top5ProductSales`;
    return axiosClient.get(url, {headers: authHeader() });
  },
  getProuctInStock: () => {
    const url = `/home/productInStock`;
    return axiosClient.get(url, {headers: authHeader() });
  },
};
export default DashboardService;
