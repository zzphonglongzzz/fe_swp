import { Close } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

const AlertPopup1 = (props) => {
  const {
    maxWidth,
    title,
    children,
    openPopup,
    setOpenPopup,
    isConfirmdelivered,
    handleConfirmDeliveredExport,
    textfieldEmail,
  } = props;

  return (
    <div>
      <Dialog
        open={openPopup}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth={maxWidth ? maxWidth : "xs"}
        fullWidth
      >
        <DialogTitle id="alert-dialog-title">
          {title}
          {textfieldEmail}
          {openPopup ? (
            <IconButton
              aria-label="close"
              onClick={() => setOpenPopup(false)}
              sx={{
                position: "absolute",
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <Close />
            </IconButton>
          ) : null}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {children}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          {isConfirmdelivered && (
            <Button onClick={handleConfirmDeliveredExport} autoFocus variant="contained">
              Xác nhận
            </Button>
          )}
          <Button
            onClick={() => {
              setOpenPopup(false);
            }}
            autoFocus
          >
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AlertPopup1;
