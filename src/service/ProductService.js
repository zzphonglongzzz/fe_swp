import axios from "axios";

const Product_BASE_REST_API_URL = "http://localhost:3000/product";

class ProductService {
  getAllProductList() {
    return axios.get(Product_BASE_REST_API_URL);
  }
  getProductbyId(ProductId) {
    return axios.get(`${Product_BASE_REST_API_URL}/${ProductId}`);
  }
  addNewProduct(Product) {
    return axios.post(Product_BASE_REST_API_URL, Product);
  }
  updateProduct(ProductId, Product) {
   return axios.put(
    Product_BASE_REST_API_URL + "/" + ProductId,
    Product
   );
 }

}
export default new ProductService();