import axios from "axios";
import axiosClient from "../utils/axiosClient";
import authHeader from "./AuthHeader";

const ManfacuturerService = {
  getManufacturerList: (params) => {
    const url = "/manufacturers";
    return axiosClient.get(url, {params, headers: authHeader() });
  },
  getManufacturerById: (id) => {
    const url = `/manufacturers/getAManufacturer`;
    return axiosClient.get(url, { params: { id }, headers: authHeader() });
  },
  searchManufacturer:(params) =>{
    const url = `/manufacturers/searchManufacturer`;
    return axiosClient.get(url, {params, headers: authHeader() });
  },
  addNewManufacturer: (manufacturer) => {
    const url = process.env.REACT_APP_API_URL + "/manufacturers/addManufacturer";
    return axios.post(
      url,
      {
        id: manufacturer.id,
        name: manufacturer.name,
        email: manufacturer.email,
        phone: manufacturer.phone,
        address: manufacturer.address,
      },
      { headers: authHeader() }
    );
  },
  updateManufacturer: (manufacturer) => {
    const url = process.env.REACT_APP_API_URL + "/manufacturers/editManufacturer";
    return axios.put(
      url,
      {
        id: manufacturer.id,
        name: manufacturer.name,
        email: manufacturer.email,
        phone: manufacturer.phone,
        address: manufacturer.address,
      },
      { headers: authHeader() }
    );
  },
};
export default ManfacuturerService;
