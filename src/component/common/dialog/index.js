import { Close } from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import React from "react";

const Popup = (props) => {
  const { title, children, openPopup, setOpenPopup } = props;

  return (
    <Dialog open={openPopup} maxWidth="md">
      <DialogTitle>
        <div style={{ display: "flex" }}>
          <Typography
            variant="h6"
            component="div"
            style={{ flexGrow: 1, fontSize: "24px" }}
          >
            {title}
          </Typography>
          <Button
            sx={{ color: "red" }}
            onClick={() => {
              setOpenPopup(false);
            }}
          >
            <Close />
          </Button>
        </div>
      </DialogTitle>
      <DialogContent dividers>{children}</DialogContent>
    </Dialog>
  );
};

export default Popup;
