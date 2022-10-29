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
  saveCategory:(category) =>{
    const url = process.env.REACT_APP_API_URL + '/category/add';
    return axios.post(url, {
      id: category.id,
      name: category.name,
      description: category.description,
    });
    },
    updateCategory: (category) => {
      const url = process.env.REACT_APP_API_URL + '/category/update';
      return axios.put(url, category);
    },
}
export default CategoryService;
