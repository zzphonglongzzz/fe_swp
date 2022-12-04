import axiosClient from "../utils/axiosClient";
import authHeader from "./AuthHeader";
import axios from "axios";

const ProductService = {
  getAllProductList:(params) => {
    const url = "/getAllProducts";
    return axiosClient.get(url, {params, headers: authHeader() });
  },
  getProductById: (params) => {
    const url = `/products/${params.productId}`;
    return axiosClient.get(url, { params, headers: authHeader() });
  },
  saveProduct: (product) => {
    const url = process.env.REACT_APP_API_URL + '/addProduct';
    return axios.post(url, {
      // id: product.id,
      productCode: product.productCode,
      name: product.name,
      description: product.description,
      unit_measure: product.unit_measure,
      category_id: product.category_id,
      subCategory_id:product.subCategory_id,
      manufacturer_id: product.manufacturer_id,
      image:product.image
    }, { headers: authHeader() });
  },
  updateProduct: (product) => {
    const url = process.env.REACT_APP_API_URL + '/updateProduct';
    return axios.put(url, {
      id: product.id,
      productCode: product.productCode,
      name: product.name,
      description: product.description,
      unit_measure: product.unit_measure,
      category_id: product.category_id,
      subCategory_id:product.subCategory_id,
      manufacturer_id: product.manufacturer_id,
      image:product.image
    } ,{ headers: authHeader() });
  },
  getAllProductNotPaging: (manufacturerId) => {
    const url = `/import/getAllProductByManufacturer/${manufacturerId}`;
    return axiosClient.get(url, { headers: authHeader() });
  },
}
export default ProductService;