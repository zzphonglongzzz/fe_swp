import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import AuthService from "../../service/AuthService";
import { toast } from "react-toastify";
import FormatDataUtils from "../../utils/FormatDataUtils";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import AlertPopup from "../../component/common/AlertPopup/index";
import { Close, Done, Edit, KeyboardReturn } from "@mui/icons-material";
import ExportProductTable from "./ExportProductTable";
import ExportOrderService from "../../service/ExportOrderService";
import Label from "../../component/common/Label";
import AlertPopup1 from "../../component/common/AlertPopup1/index";
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';

const getStatusLabel = (exportOrderStatus) => {
  const map = {
    3: {
      text: "Đã huỷ",
      color: "error",
    },
    2: {
      text: "Đã xuất kho",
      color: "success",
    },
    1: {
      text: "Đang chờ xử lý",
      color: "warning",
    },
    4: {
      text: "Đã trả hàng",
      color: "primary",
    },
  };

  const { text, color } = map[exportOrderStatus];

  return <Label color={color}>{text}</Label>;
};
const getStatusDeliver = (exportOrderStatus) => {
  const map = {
    null: {
      text: "Đang giao hàng",
      color: "warning",
    },
    1: {
      text: "Đã giao hàng",
      color: "success",
    },
    0: {
      text: "Đã hủy giao hàng",
      color: "error",
    },
  };
  const { text, color } = map[exportOrderStatus];
  return <Label color={color}>{text}</Label>;
};
const ExportOrderDetail = () => {
  const { exportOrderId } = useParams();
  const navigate = useNavigate();
  const [exportOrder, setExportOrder] = useState();
  const [openPopup, setOpenPopup] = useState(false);
  const [openPopup1, setOpenPopup1] = useState(false);
  const [title, setTitle] = useState("");
  const [title1, setTitle1] = useState("");
  const [message, setMessage] = useState("");
  const [message1, setMessage1] = useState("");
  const [isConfirm, setIsConfirm] = useState(false);
  const [isConfirmdelivered, setIsConfirmdelivered] = useState(false);
  const currentUserRole = AuthService.getCurrentUser().roles[0];

  const calculateTotalAmount = () => {
    let totalAmount = 0;
    if (exportOrder) {
      const productList = exportOrder;
      for (let index = 0; index < productList.length; index++) {
        totalAmount =
          totalAmount +
          +productList[index]?.quantity * +productList[index]?.unit_price;
      }
    }
    return totalAmount;
  };

  const handleOnClickConfirmDeliveredExport = () => {
    setTitle1("Bạn có chắc chắn muốn xác nhận giao hàng hay không?");
    setMessage1("Hãy kiểm tra kỹ hàng hóa trước khi xác nhận.");
    setIsConfirmdelivered(true);
    setOpenPopup1(true);
  };

  const handleOnClickConfirm = () => {
    setTitle("Bạn có chắc chắn muốn xác nhận xuất hàng hay không?");
    setIsConfirm(true);
    setOpenPopup(true);
  };

  const handleOnClickCancel = () => {
    setTitle("Bạn có chắc chắn muốn hủy phiếu xuất hàng không?");
    setMessage("");
    setIsConfirm(false);
    setOpenPopup(true);
  };
  const handleConfirm = async () => {
    if (isConfirm) {
      console.log("Xác nhận");
      try {
        const confirmUserId = AuthService.getCurrentUser().id;
        const params = {
          orderId: exportOrderId,
          confirmBy: confirmUserId,
        };
        const result = await ExportOrderService.confirmExportOrder(params);
        console.log(result);
        if (!!result) {
          if (!!result.message) {
            toast.success(result.message);
          } else {
            toast.success("Xác nhận xuất kho thành công!");
          }
          fetchExportOrderDetail();
          setOpenPopup(false);
        }
      } catch (error) {
        console.log("Failed to confirm importOder: ", error);
        if (error.message) {
          toast.error(error.message);
        } else {
          toast.error("Lỗi! Xác nhận xuất kho thất bại!");
        }
      }
    } else {
      console.log("Huỷ");
      try {
        const confirmUserId = AuthService.getCurrentUser().id;
        const params = {
          orderId: exportOrderId,
          confirmBy: confirmUserId,
        };
        const result = await ExportOrderService.cancelExportOrder(params);
        console.log(result);
        if (!!result) {
          if (!!result.message) {
            toast.success(result.message);
            navigate("/export/list");
          } else {
            toast.success("Huỷ xuất kho thành công!");
            navigate("/export/list");
          }
          fetchExportOrderDetail();
          setOpenPopup(false);
        }
      } catch (error) {
        console.log("Failed to cancel importOder: ", error);
        if (error.message) {
          toast.error(error.message);
        } else {
          toast.error("Lỗi! Huỷ xuất kho thất bại!");
        }
      }
    }
  };
  const handleConfirmDeliveredExport = async () => {
    if (isConfirmdelivered) {
      console.log("Xác nhận");
      try {
        const result = await ExportOrderService.deliveredExportOrder(
          exportOrderId
        );
        if (!!result) {
          if (!!result.message) {
            toast.success(result.message);
          } else {
            toast.success("Xác nhận xuất kho thành công!");
          }
          fetchExportOrderDetail();
          setOpenPopup1(false);
        }
      } catch (error) {
        console.log("Failed to confirm importOder: ", error);
        if (error.message) {
          toast.error("Số lượng hàng trong lô không đủ !!");
        } else {
          toast.error("Lỗi! Xác nhận xuất kho thất bại!");
        }
      }
    }
  };

  const fetchExportOrderDetail = async () => {
    try {
      const params = {
        orderId: exportOrderId,
      };
      const dataResult = await ExportOrderService.getExportOrderById(params);
      //const dataResult = unwrapResult(actionResult);
      if (
        dataResult.data &&
        !FormatDataUtils.isEmptyObject(dataResult.data.listExportProduct)
      ) {
        setExportOrder(dataResult.data.listExportProduct);
        console.log(dataResult.data.listExportProduct?.is_return);
      } else {
        navigate("/404");
      }
      console.log("Export Order Detail", dataResult);
    } catch (error) {
      console.log("Failed to fetch exportOrder detail: ", error);
    }
  };
  useEffect(() => {
    if (isNaN(exportOrderId)) {
      navigate("/404");
    } else {
      fetchExportOrderDetail();
    }
  }, []);
  return (
    <Box>
      {exportOrder && (
        <Grid container spacing={2}>
          <Grid xs={12} item>
            <Card>
              <Stack direction="row" justifyContent="space-between" p={2}>
                <Box className="billReferenceContainer">
                  <Typography variant="span">
                    <strong>Phiếu xuất kho số:</strong> {"XUAT" + exportOrderId}
                  </Typography>{" "}
                  {exportOrder[0].status_id === 4|| exportOrder[0].status_id === 1 || exportOrder[0].status_id === 3
                      ? getStatusLabel(exportOrder[0].status_id)
                      : exportOrder[0].status_id !== 1 && (
                          <span>
                            {getStatusDeliver(
                              exportOrder[0].is_return === null
                                ? null
                                : exportOrder[0].is_return === true
                                ? 1
                                : exportOrder[0].is_return === false
                                ? 0
                                : undefined
                            )}
                          </span>
                    )}
                </Box>
                {exportOrder[0].confirm_by == null && (
                  <Stack
                    direction="row"
                    justifyContent="flex-end"
                    spacing={2}
                    className="buttonAction"
                  >
                    {currentUserRole === "ROLE_ADMIN" && (
                      <Button
                        variant="contained"
                        startIcon={<Done />}
                        color="success"
                        onClick={() => handleOnClickConfirm()}
                      >
                        Xác nhận xuất kho
                      </Button>
                    )}
                    {currentUserRole === "ROLE_ADMIN" && (
                      <Button
                        variant="contained"
                        startIcon={<Edit />}
                        color="warning"
                        onClick={() => {
                          navigate(`/export/edit/${exportOrderId}`);
                        }}
                      >
                        Chỉnh sửa
                      </Button>
                    )}
                    <Button
                      variant="contained"
                      startIcon={<Close />}
                      color="error"
                      onClick={() => handleOnClickCancel()}
                    >
                      Huỷ phiếu xuất kho
                    </Button>
                  </Stack>
                )}
                {exportOrder[0].confirm_by !== null &&
                  exportOrder[0].status_id != 4 &&
                  exportOrder[0].is_return == null && (
                    <Stack
                      direction="row"
                      justifyContent="flex-end"
                      spacing={2}
                      className="buttonAction"
                    >
                      {currentUserRole === "ROLE_USER" && (
                        <Button
                          variant="contained"
                          startIcon={<Done />}
                          color="success"
                          onClick={() => handleOnClickConfirmDeliveredExport()}
                        >
                          Xác nhận giao hàng
                        </Button>
                      )}
                      {currentUserRole === "ROLE_USER" && (
                        <Button
                          variant="contained"
                          startIcon={<Edit />}
                          color="warning"
                          onClick={() => {
                            navigate(`/export/cancel/${exportOrderId}`);
                          }}
                        >
                          Chi tiết hủy giao hàng
                        </Button>
                      )}
                    </Stack>
                  )}

                {exportOrder[0].confirm_by !== null &&
                  exportOrder[0].status_id != 4 &&
                  exportOrder[0].is_return == 1 &&
                  currentUserRole === "ROLE_ADMIN" && (
                    <Stack
                      direction="row"
                      justifyContent="flex-end"
                      spacing={2}
                      className="buttonAction"
                    >
                      <Button
                        variant="contained"
                        startIcon={<KeyboardReturn />}
                        color="warning"
                        onClick={() =>
                          navigate(`/export/return/${exportOrderId}`)
                        }
                      >
                        Trả hàng
                      </Button>
                    </Stack>
                  )}
                {exportOrder[0].confirm_by !== null &&
                  exportOrder[0].status_id != 4 &&
                  exportOrder[0].is_return == 0 &&
                  currentUserRole === "ROLE_ADMIN" && (
                    <Stack
                      direction="row"
                      justifyContent="flex-end"
                      spacing={2}
                      className="buttonAction"
                    >
                      <Button
                        variant="contained"
                        startIcon={<RemoveRedEyeIcon />}
                        color="warning"
                        onClick={() =>
                          navigate(`/export/cancel/detail/${exportOrderId}`)
                        }
                      >
                        Xem chi tiết bị hủy
                      </Button>
                    </Stack>
                  )}
              </Stack>
            </Card>
          </Grid>
          <Grid xs={9} item>
            <Grid container spacing={2}>
              <Grid xs={12} item>
                <Card className="cardTable">
                  {exportOrder && exportOrder?.length > 0 ? (
                    <ExportProductTable listConsignment={exportOrder} />
                  ) : (
                    <Box>Đơn xuất hàng không có lô hàng nào</Box>
                  )}
                </Card>
              </Grid>
            </Grid>
          </Grid>
          <Grid xs={3} item>
            <Grid container spacing={2}>
              <Grid xs={12} item>
                <Card>
                  <CardContent className="confirmInfo">
                    <Stack spacing={2}>
                      <Box>
                        <Typography variant="h6">Thông tin xác nhận</Typography>
                        <Typography>
                          Người tạo đơn:{" "}
                          <i>{"(" + exportOrder[0].creator + ")"}</i>
                        </Typography>
                      </Box>
                      {exportOrder[0].confirm_by !== null && (
                        <Box>
                          <Typography>
                            Người xác nhận:{" "}
                            <i>{"(" + exportOrder[0].confirm_by + ")"}</i>
                          </Typography>
                        </Box>
                      )}
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid xs={12} item>
                <Card>
                  <CardContent className="totalAmount">
                    <Typography variant="h6">Tổng giá trị đơn hàng</Typography>
                    <br />
                    <Typography align="right">
                      {FormatDataUtils.formatCurrency(calculateTotalAmount())}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>
          <AlertPopup
            maxWidth="sm"
            title={title}
            openPopup={openPopup}
            setOpenPopup={setOpenPopup}
            isConfirm={true}
            handleConfirm={handleConfirm}
          >
            <Box component={"span"} className="popupMessageContainer">
              {message}
            </Box>
          </AlertPopup>
          <AlertPopup1
            maxWidth="sm"
            title={title1}
            openPopup={openPopup1}
            setOpenPopup={setOpenPopup1}
            isConfirmdelivered={true}
            handleConfirmDeliveredExport={handleConfirmDeliveredExport}
          >
            <Box component={"span"} className="popupMessageContainer">
              {message1}
            </Box>
          </AlertPopup1>
        </Grid>
      )}
    </Box>
  );
};

export default ExportOrderDetail;
