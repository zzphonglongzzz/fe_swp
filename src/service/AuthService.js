import axios from "axios";
import { toast } from "react-toastify";
import authHeader from "./AuthHeader";

const login = (username, password) => {
  return axios
    .post(process.env.REACT_APP_API_URL + "/auth/signin", {
      username,
      password,
    })
    .then(
      (response) => {
        if (response.data.accessToken) {
          localStorage.setItem("user", JSON.stringify(response.data));
        }
        return response.data;
      },
      (error) => {
        const errResponse = error.response;
        if (!errResponse) {
          return Promise.reject(error);
        }
        if (errResponse.status === 401) {
          toast.error("Tên đăng nhập hoặc mật khẩu không chính xác");
        }

        return Promise.reject(error);
      }
    );
};
const register = (username, email, password) => {
  return axios.post(process.env.REACT_APP_API_URL + "/auth/signup", {
    username,
    email,
    password,
  });
};
const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};
const forgotPassword = (email) => {
  const url = process.env.REACT_APP_API_URL + `/forgot_password`;
  return axios
    .post(url, email)
    .then((response) => {
      if (response.data) {
        return response.data;
      }
    })
    .catch((error) => {
      const errResponse = error.message;
      if (!errResponse) {
        return Promise.reject(error);
      }

      return Promise.reject(error);
    });
};
const logout = () => {
  localStorage.removeItem("user");
};
const setNewPassword = (userInfo) => {
  const url = process.env.REACT_APP_API_URL + `/user/userprofile/change_password`;

  return axios
    .put(url, userInfo, {
      headers: authHeader(),
    })
    .then(
      (response) => {
        if (response.data) {
          return response.data;
        }
      },
      (error) => {
        const errResponse = error.message;
        if (!errResponse) {
          return Promise.reject(error);
        }

        return Promise.reject(error);
      }
    );
};
const checkOtp = (userInfo) => {
  const url = process.env.REACT_APP_API_URL + `/check_otp`;

  return axios
    .post(url, userInfo, {
      headers: authHeader(),
    })
    .then(
      (response) => {
        if (response.data) {
          return response.data;
        }
      },
      (error) => {
        const errResponse = error.message;
        if (!errResponse) {
          return Promise.reject(error);
        }

        return Promise.reject(error);
      }
    );
};
const AuthService = {
  register,
  login,
  logout,
  getCurrentUser,
  forgotPassword,
  checkOtp,
  setNewPassword,
};
export default AuthService;
