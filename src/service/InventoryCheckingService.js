import axios from "axios";
import axiosClient from "../utils/axiosClient";
import authHeader from "./AuthHeader";

const InventoryCheckingService = {
  getListInventoryChecking: (params) => {
    const url = `/stockTakingHistory`;
    return axiosClient.get(url, { params, headers: authHeader() });
  },
  getProductByWarehouseId: (wareHouseId) => {
    const url = `/stockTakingHistory/productByWarehouse?warehouse_id=${wareHouseId}`;
    return axiosClient.get(url, { headers: authHeader() });
  },
  getConsignmentByProductId: (params) => {
    const { productId, warehouseId } = params;
    const url = `/stockTakingHistory/productDetails?id=${productId}&wid=${warehouseId}`;
    return axiosClient.get(url, { headers: authHeader() });
  },
  createInventoryChecking: (inventoryChecking) => {
    const url = process.env.REACT_APP_API_URL +`/stockTakingHistory/createStockTakingHistory`;
    return axios.put(url, inventoryChecking, { headers: authHeader() });
  },
  getInventoryCheckingHistoryDetail: (inventoryCheckingHistoryId) => {
    const url = `/stockTakingHistory/detail/${inventoryCheckingHistoryId}`;
    return axiosClient.get(url, { headers: authHeader() });
  },
};
export default InventoryCheckingService;
