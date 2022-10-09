import * as React from "react";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import {
  Form,
  Formik,
  FormikConfig,
  FormikValues,
  FormikHelpers,
  Field,
} from "formik";
import { useState } from "react";
import { IconButton, TextField, Tooltip } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import "./forgotPassword.scss";

export default function ConfirmPassword() {
  const [passwordShown, setPasswordShown] = useState(false);
  const [confirmPasswordShown, setConfirmPasswordShown] = useState(false);
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
          <label>
            Hãy điền dãy số mã hóa mà bạn đã nhận được ở trong email của mình để
            được cấp quyền cài đặt lại mật khẩu
          </label>
          <Field
            name="password"
            label="Mật khẩu mới"
            margin="normal"
            fullWidth
            id="password"
            type={passwordShown ? "text" : "password"}
            InputProps={{
              endAdornment: (
                <Tooltip
                  title={passwordShown ? "Ẩn mật khẩu" : "Hiển thị mật khẩu"}
                  arrow
                >
                  <IconButton onClick={() => setPasswordShown(!passwordShown)}>
                    {passwordShown ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </Tooltip>
              ),
            }}
            autoComplete="password"
          />

          <TextField
            name="confirmPassword"
            label="Nhập lại mật khẩu mới"
            margin="normal"
            fullWidth
            type={confirmPasswordShown ? "text" : "password"}
            InputProps={{
              endAdornment: (
                <Tooltip
                  title={
                    confirmPasswordShown ? "Ẩn mật khẩu" : "Hiển thị mật khẩu"
                  }
                  arrow
                >
                  <IconButton
                    onClick={() =>
                      setConfirmPasswordShown(!confirmPasswordShown)
                    }
                  >
                    {confirmPasswordShown ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </Tooltip>
              ),
            }}
            id="confirmPassword"
            autoComplete="confirmPassword"
          />
        </Box>
      </Box>
    </Grid>
  );
}
