import * as React from "react";
import Box from "@mui/material/Box";
import ForgotPassword from "./ForgotPassword";
import RequestCodeForm from "./RequestCodeForm";
import ConfirmPassword from "./ConfirmPassword";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import LoadingButton from "@mui/lab/LoadingButton";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CommonForgotPassword.scss";
import AuthService from "../../service/AuthService";

function getStepContent(step) {
  switch (step) {
    case 0:
      return <ForgotPassword />;
    case 1:
      return <RequestCodeForm />;
    case 2:
      return <ConfirmPassword />;
    default:
      throw new Error("Unknown step");
  }
}

export default function CommonForgotPass() {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const initialValue = {
    email: "",
    otp: "",
    password: "",
    confirmPassword: "",
  };

  const FORM_VALIDATION = Yup.object().shape({
    email: Yup.string().required("Vui lòng nhập email để tiếp tục"),
    password: Yup.string()
      .required("Vui lòng nhập mật khẩu mới")
      .min(8, "Vui lòng nhập ít nhất 8 ký tự")
      .matches(
        /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/,
        "Vui lòng nhập mật khẩu có ít 8 ký tự, trong đó có chứa cả chữ và số"
      ),
    confirmPassword: Yup.string().oneOf(
      [Yup.ref("password"), null],
      "Mật khẩu mới và mật khẩu nhập lại không khớp"
    ),
  });

  const sendMailForgotPassword = (values) => {
    const email = { email_request: values.email };
    console.log(values.email);
    setLoading(true);
    AuthService.forgotPassword(email).then(
      (response) => {
        console.log(response.status);
        if (!response.status) {
          toast.success(response.message);
          localStorage.setItem("token", response.data)
          setLoading(false);
          setActiveStep(activeStep + 1);
        } else {
          setLoading(false);
          toast.error(response.message);
          //setActiveStep(activeStep + 1);
        }
      },
      (error) => {
        toast.error(error.response.data.message);
        setLoading(false);
      }
    );
  };

  const handleNext = (values) => {
    console.log(values);
    switch (activeStep) {
      case 0:
        const email = { email_request: values.email };
        console.log(values.email);
        setLoading(true);
        AuthService.forgotPassword(email).then(
          (response) => {
            console.log(response.status);
            if (!response.status) {
              toast.success(response.message);
              localStorage.setItem("token", response.data)
              setLoading(false);
              setActiveStep(activeStep + 1);
            } else {
              setLoading(false);
              toast.error(response.message);
              //setActiveStep(activeStep + 1);
            }
          },
          (error) => {
            toast.error("Không tìm thấy email đăng ký");
            setLoading(false);
          }
        );
        break;
      case 1:
        const userOtp = { otp: values.otp };
        setLoading(true);
        AuthService.checkOtp(userOtp).then(
          (response) => {
            console.log(response);
            if (response.status === 200) {
              toast.success(response.message);
              setLoading(false);
              setActiveStep(activeStep + 1);
            } else {
              toast.error(response.message);
              setLoading(false);
            }
          },
          (error) => {
            toast.error(error.response.data.message);
            setLoading(false);
          }
        );
        break;
      case 2:
        const userInfo = {
          new_password: values.password,
          confirm_password: values.confirmPassword,
          otp: values.otp
        };
        console.log(userInfo)
        setLoading(true);
        AuthService.setNewPassword(userInfo).then(
          (response) => {
            console.log(response);
            toast.success(response.message);
            setLoading(false);
            localStorage.removeItem("token");
            navigate("/");
          },
          (error) => {
            toast.error(error.response.data.message);
            setLoading(false);
          }
        );
        break;
      default:
        break;
    }
  };

  return (
    <Grid item component="main">
      <Formik
        initialValues={{ ...initialValue }}
        validationSchema={FORM_VALIDATION}
        onSubmit={(values) => handleNext(values)}
      >
        {({ values }) => (
          <Form>
            <Box
              sx={{
                marginTop: 3,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "32px",
              }}
            >
              {getStepContent(activeStep)}
              <Box sx={{ display: "block", justifyContent: "center" }}>
                <LoadingButton
                  variant="contained"
                  type={activeStep === 2 ? "submit" : "button"}
                  onClick={() => {
                    if (activeStep < 2) {
                      handleNext(values);
                    }
                  }}
                  loading={loading}
                  loadingPosition="center"
                  sx={{
                    mt: 3,
                    ml: 1,
                    width: "410px",
                    padding: "10px 0",
                    left: "-5px",
                    marginTop: "0",
                  }}
                >
                  Gửi
                </LoadingButton>
              </Box>

              {activeStep === 1 ? (
                <div className="styleLabel">
                  <div>
                    <label>
                      Nếu bạn vẫn chưa xử lý được, hãy liên hệ với quản lý của
                      bạn để được hỗ trợ cài lại mật khẩu. SĐT: 0868752500
                    </label>
                  </div>
                </div>
              ) : (
                ""
              )}
            </Box>
          </Form>
        )}
      </Formik>
    </Grid>
  );
}
