import axiosClient from "../utils/axiosClient";
import axios from "axios";

const importOrderService = {
  createImportOrder: (importOrder) => {
    const url = process.env.REACT_APP_API_URL + "/import-order/create";
    // const url = process.env.REACT_APP_API_URL + '/import-order/create';
    // console.log(importOrder);
    return axios.post(
      url,
      {
        //billReferenceNumber: importOrder.billReferenceNumber,
        createdDate: importOrder.createdDate,
        description: importOrder.description,
        //userId: importOrder.userId,
        manufactorId: importOrder.manufactorId,
        // wareHouseId: '',
        wareHouseId: importOrder.wareHouseId,
        consignmentRequests: importOrder.consignmentRequests,
      }
    );
  },
};
export default importOrderService;
