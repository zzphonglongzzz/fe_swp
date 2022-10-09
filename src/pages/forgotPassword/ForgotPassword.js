import * as React from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import './forgotPassword.scss'
import Box from "@mui/material/Box";
import {
  Form,
  Formik,
  FormikConfig,
  FormikValues,
  FormikHelpers,
  Field,
} from "formik";
import * as Yup from "yup";
import { TextField } from "@mui/material";

export default function ForgotPassword() {
  return (
    <Grid item component="main">
      <Box
        sx={{
          marginTop: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "32px",
          
        }}
      >
        <Typography component="h1" variant="h5">
          Quên mật khẩu
        </Typography>
        <Box sx={{ mt: 1 }} className="styleForm">
          <label htmlFor="email">
            Bạn quên mật khẩu? Vui lòng điền email đã dùng để đăng ký tài khoản
            của bạn ở đây.
          </label>
          <TextField
            name="email"
            label="Email"
            margin="normal"
            fullWidth
            id="email"
            autoComplete="email"
          />
        </Box>
      </Box>
    </Grid>
  );
}
