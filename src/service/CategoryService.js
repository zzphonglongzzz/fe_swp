import axiosClient from "../utils/axiosClient";
import axios from "axios";
import authHeader from "./AuthHeader";

const CategoryService = {
  getAll: () => {
    const url = "/category";
    return axiosClient.get(url, { headers: authHeader() });
  },
  getCategoryDetail: (params) => {
    const url = `/category/${params.categoryId}`;
    return axiosClient.get(url, { params, headers: authHeader() });
  },
  saveSubCategory: (category) => {
    const url = process.env.REACT_APP_API_URL + "/subCategory/add";
    return axios.post(url, category, { headers: authHeader() });
  },
  updateSubCategory: (category) => {
    const url = process.env.REACT_APP_API_URL + "/subCategory/update";
    return axios.put(url, category, { headers: authHeader() });
  },
  getSubCategoryByCategoryId: (params) => {
    const url = "/subCategory";
    return axiosClient.get(url, { params, headers: authHeader() });
  },
  saveCategory: (category) => {
    const url = process.env.REACT_APP_API_URL + "/category/add";
    return axios.post(
      url,
      {
        id: category.id,
        name: category.name,
        description: category.description,
      },
      { headers: authHeader() }
    );
  },
  updateCategory: (category) => {
    const url = process.env.REACT_APP_API_URL + "/category/update";
    return axios.put(url, category, { headers: authHeader() });
  },
};
export default CategoryService;
