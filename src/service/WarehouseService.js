import axios from "axios";

const Warehouse_BASE_REST_API_URL = "http://localhost:3000/warehouse";

class WarehouseService{
     getlistWarehouse(){
        return axios.get(Warehouse_BASE_REST_API_URL);
     }
}
export default new WarehouseService();
