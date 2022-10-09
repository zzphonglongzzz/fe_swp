import axios from "axios";

const Manufacturer_BASE_REST_API_URL = "http://localhost:3000/manufacturer";

class ManfacuturerService {
  getAllManufacturer() {
    return axios.get(Manufacturer_BASE_REST_API_URL);
  }
  getManufacturerById(manufacturerId) {
    return axios.get(`${Manufacturer_BASE_REST_API_URL}/${manufacturerId}`);
  }
  createNewManfacturer(manufacturer) {
    return axios.post(Manufacturer_BASE_REST_API_URL, manufacturer);
  }
  updateManufacturer(manufacturerId, manufacturer) {
    return axios.put(
      Manufacturer_BASE_REST_API_URL + "/" + manufacturerId,
      manufacturer
    );
  }
}
export default new ManfacuturerService();
