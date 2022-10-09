import * as React from "react";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import { Form, Formik, FormikConfig, FormikValues, FormikHelpers, Field } from 'formik';
import './forgotPassword.scss'
import Box from "@mui/material/Box";
import { TextField } from "@mui/material";

export default function RequestCodeForm() {
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
            Hãy điền dãy số mã hóa mà bạn đã nhận được ở trong email của mình để
            được cấp quyền cài đặt lại mật khẩu
          </label>
          <TextField
            name="otp"
            label="Mã số"
            margin="normal"
            fullWidth
            id="otp"
            autoComplete="otp"
          />
        </Box>
      </Box>
    </Grid>
  );
}
