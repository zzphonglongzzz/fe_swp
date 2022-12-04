import axiosClient from "../utils/axiosClient";
import authHeader from "./AuthHeader";
import axios from "axios";

const StaffService = {
    getStaffList: (params) => {
      const url = '/staff';
      return axiosClient.get(url, { params, headers: authHeader() });
    },
    getStaffById: (staffId) => {
        const url = `/staff/getAStaff/${staffId}`;
        return axiosClient.get(url, { headers: authHeader() });
    },
    createStaff: (staff) => {
        const url = process.env.REACT_APP_API_URL + '/staff/addStaff';
        return axios.post(url, staff, { headers: authHeader() });
    },
    updateStaff :(staff) =>{
        const url = process.env.REACT_APP_API_URL + '/staff/editStaff';
        return axios.put(url, staff, { headers: authHeader() });
    }
}
export default StaffService;