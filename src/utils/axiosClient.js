import axios from "axios";
import queryString from "query-string";

const axiosClient = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "content-type": "application/json",
  },
  paramsSerializer: (params) => queryString.stringify(params),
});
axiosClient.interceptors.request.use(
  (req) => {
    return req;
  },
  (error) => {
    return Promise.reject(error);
  },
);

axiosClient.interceptors.response.use(
  (response) => {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    if (response && response.data) {
      return response.data;
    }
    return response;
  },
  (error) => {
    const errResponse = error.response;
    if (!errResponse) {
      return Promise.reject(error);
    }
    if (errResponse.status === 403) {
      alert('Bạn không có quyền thực hiện chức năng này');
      // localStorage.clear();
      window.location = '/';
    }
    if (errResponse.status === 401) {
      alert('Phiên làm việc hết hạn');
      // alert('Bạn chưa đăng nhập');
      localStorage.clear();
      window.location = '/';
    }

    if (errResponse.data.status === 405) {
      alert(errResponse.data.message);
      localStorage.clear();
      window.location = '/';
    }
    console.log(errResponse)
    return Promise.reject(error);
  },
);

export default axiosClient;
