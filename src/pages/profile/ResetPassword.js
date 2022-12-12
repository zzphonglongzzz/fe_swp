import { toast } from "react-toastify";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  Container,
  IconButton,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import AuthService from "../../service/AuthService";
import { Form, Formik, useField } from "formik";
import React, { useState } from "react";
import { LockReset, Visibility, VisibilityOff } from "@mui/icons-material";
import LoadingButton from "@mui/lab/LoadingButton";

const TextfieldWrapper = ({ name, ...otherProps }) => {
  const [field, meta] = useField(name);

  const configTextfield = {
    ...field,
    ...otherProps,
  };

  if (meta && meta.touched && meta.error) {
    configTextfield.error = true;
    configTextfield.helperText = meta.error;
  }
  return <TextField {...configTextfield} />;
};
const ResetPassword = () => {
  const navigate = useNavigate();
  const currentUser = AuthService.getCurrentUser();
  const [oldPasswordShown, setOldPasswordShown] = useState(false);
  const [newPasswordShown, setNewPasswordShown] = useState(false);
  const [reNewPasswordShown, setReNewPasswordShown] = useState(false);
  const initialFormValue = {
    oldPassword: "",
    newPassword: "",
    reNewPassword: "",
  };
  const FORM_VALIDATION = Yup.object().shape({
    oldPassword: Yup.string().required("Vui lòng nhập mật khẩu cũ"),
    newPassword: Yup.string()
      .required("Vui lòng nhập mật khẩu mới")
      .min(8, "Vui lòng nhập ít nhất 8 ký tự")
      .matches(
        /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/,
        "Vui lòng nhập mật khẩu có ít 8 ký tự, trong đó có chứa cả chữ và số"
      ),
    reNewPassword: Yup.string().oneOf(
      [Yup.ref("newPassword"), null],
      "Mật khẩu mới và mật khẩu nhập lại không khớp"
    ),
  });
  const handleSubmit = async (values) => {
    console.log(values);
    const newPassword = {
      user_id: currentUser.id,
      current_pass: values.oldPassword,
      new_pass: values.newPassword,
      confirm_pass: values.reNewPassword,
    };
    console.log(newPassword);
    try {
      const dataResult = await AuthService.setNewPassword(newPassword);
      //const dataResult = unwrapResult(actionResult);
      console.log(dataResult);
      if (dataResult) {
        if (dataResult.status === 500) {
          toast.error(dataResult.message);
        } else {
          toast.success(dataResult.message);
          navigate("/profile");
        }
      }
    } catch (error) {
      console.log("Failed to reset password: ", error.message);
      toast.error(error.message);
    }
  };
  return (
    <Container maxWidth="lg">
      <Formik
        initialValues={{ ...initialFormValue }}
        validationSchema={FORM_VALIDATION}
        onSubmit={(values) => {
          handleSubmit(values);
        }}
      >
        {({ values, errors, setFieldValue }) => (
          <Form>
            <Card>
              <Stack
                direction="column"
                justifyContent="center"
                alignItems="center"
                py={4}
                spacing={2}
              >
                <Stack width={400}>
                  <Typography variant="h6">Nhập mật khẩu hiện tại</Typography>
                  <TextfieldWrapper
                    name="oldPassword"
                    fullWidth
                    type={oldPasswordShown ? "text" : "password"}
                    InputProps={{
                      endAdornment: (
                        <Tooltip
                          title={
                            oldPasswordShown
                              ? "Ẩn mật khẩu"
                              : "Hiển thị mật khẩu"
                          }
                          arrow
                        >
                          <IconButton
                            onClick={() =>
                              setOldPasswordShown(!oldPasswordShown)
                            }
                          >
                            {oldPasswordShown ? (
                              <VisibilityOff />
                            ) : (
                              <Visibility />
                            )}
                          </IconButton>
                        </Tooltip>
                      ),
                    }}
                  />
                </Stack>
                <Stack width={400}>
                  <Typography variant="h6">Nhập mật khẩu mới</Typography>
                  <TextfieldWrapper
                    name="newPassword"
                    fullWidth
                    type={newPasswordShown ? "text" : "password"}
                    InputProps={{
                      endAdornment: (
                        <Tooltip
                          title={
                            newPasswordShown
                              ? "Ẩn mật khẩu"
                              : "Hiển thị mật khẩu"
                          }
                          arrow
                        >
                          <IconButton
                            onClick={() =>
                              setNewPasswordShown(!newPasswordShown)
                            }
                          >
                            {newPasswordShown ? (
                              <VisibilityOff />
                            ) : (
                              <Visibility />
                            )}
                          </IconButton>
                        </Tooltip>
                      ),
                    }}
                  />
                </Stack>
                <Stack width={400}>
                  <Typography variant="h6">Nhập lại mật khẩu mới</Typography>
                  <TextfieldWrapper
                    name="reNewPassword"
                    fullWidth
                    type={reNewPasswordShown ? "text" : "password"}
                    InputProps={{
                      endAdornment: (
                        <Tooltip
                          title={
                            reNewPasswordShown
                              ? "Ẩn mật khẩu"
                              : "Hiển thị mật khẩu"
                          }
                          arrow
                        >
                          <IconButton
                            onClick={() =>
                              setReNewPasswordShown(!reNewPasswordShown)
                            }
                          >
                            {reNewPasswordShown ? (
                              <VisibilityOff />
                            ) : (
                              <Visibility />
                            )}
                          </IconButton>
                        </Tooltip>
                      ),
                    }}
                  />
                </Stack>
                <Stack>
                  <Typography>
                    Hãy đảm bảo rằng mật khẩu của bạn có chứa ít nhất 8 ký tự,
                    trong đó có phải có chữ và số.
                  </Typography>
                </Stack>
                <Stack>
                  <LoadingButton
                    variant="contained"
                    loadingposition="start"
                    startIcon={<LockReset />}
                    type="submit"
                  >
                    Đổi mật khẩu
                  </LoadingButton>
                </Stack>
              </Stack>
            </Card>
          </Form>
        )}
      </Formik>
    </Container>
  );
};

export default ResetPassword;
