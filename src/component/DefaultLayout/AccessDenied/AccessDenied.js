import { Button, Stack, Typography } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";

const AccessDenied = () => {
  const navigate = useNavigate();
  return (
    <Stack height={1000} justifyContent="center" alignItems="center" spacing={3}>
      <img
        alt=""
        height={500}
        width={500}
        accept="image/*"
        src="/image/403_Error.png"
      />
      <Typography variant="h4">
        <b>Bạn không có quyền truy cập vào trang này</b>
      </Typography>
      <Button variant="contained" onClick={() => navigate("/")}>
        Đi đến trang chủ
      </Button>
    </Stack>
  );
};

export default AccessDenied;
