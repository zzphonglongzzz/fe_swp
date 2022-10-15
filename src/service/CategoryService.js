import axiosClient from "../utils/axiosClient";
import axios from "axios";

const CategoryService = {
  getAll:() => {
    const url = '/category';
    return axiosClient.get(url);
  },
  getCategoryDetail: (params) => {
    const url = `/category/${params.categoryId}`;
    return axiosClient.get(url, {params});
  },
  saveSubCategory: (category) => {
    const url = process.env.REACT_APP_API_URL + '/subCategory/add'
    return axios.post(url, category);
  },
  updateSubCategory: (category) => {
    const url = process.env.REACT_APP_API_URL + '/subCategory/update';
    return axios.put(url, category);
  },
  getSubCategoryByCategoryId: (params) => {
    const url = '/subCategory';
    return axiosClient.get(url, { params });
  },
}
export default CategoryService;
