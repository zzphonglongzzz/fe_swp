import { Button, Stack, Typography } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="not-found">
      <img
        src="https://www.pngitem.com/pimgs/m/561-5616833_image-not-found-png-not-found-404-png.png"
        alt="not-found"
      />
      <Button variant="contained" onClick={() => navigate("/")}>
        Đi đến trang chủ
      </Button>
    </div>
  );
};

export default NotFound;
