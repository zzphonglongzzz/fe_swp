import axios from 'axios'

const CATEGORY_BASE_REST_API_URL = "http://localhost:3000/categories";

class CategoryService{
    getAllCategory(){
        return axios.get(CATEGORY_BASE_REST_API_URL)
    }
    getAllCategoryDetail(CategoryId){
        return axios.get(CATEGORY_BASE_REST_API_URL+ "/" + CategoryId)
    }
}
export default new CategoryService()