import axios from "axios";
import axiosClient from "../utils/axiosClient";

const ManfacuturerService = {
  getManufacturerList: () => {
    const url = "/manufacturers";
    return axiosClient.get(url);
  },
  getManufacturerById: (id) => {
    const url = `/getAManufacturer`;
    return axiosClient.get(url, { params: { id } });
  },
  addNewManufacturer: (manufacturer) => {
    const url = process.env.REACT_APP_API_URL + "/addManufacturer";
    return axios.post(url, {
      id: manufacturer.id,
      name: manufacturer.name,
      email: manufacturer.email,
      phone: manufacturer.phone,
      address: manufacturer.address,
    });
  },
  updateManufacturer: (manufacturer) => {
    const url = process.env.REACT_APP_API_URL + "/editManufacturer";
    return axios.put(url, {
      id: manufacturer.id,
      name: manufacturer.name,
      email: manufacturer.email,
      phone: manufacturer.phone,
      address: manufacturer.address,
    });
  },
};
export default ManfacuturerService;
