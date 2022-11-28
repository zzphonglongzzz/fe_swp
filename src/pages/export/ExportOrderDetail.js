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
  Divider,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import AlertPopup from "../../component/common/AlertPopup";
import { Close, Done, Edit, KeyboardReturn } from "@mui/icons-material";
import ExportProductTable from "./ExportProductTable";
import ExportOrderService from "../../service/ExportOrderService";

const ExportOrderDetail = () => {
  const { exportOrderId } = useParams();
  const navigate = useNavigate();
  const [exportOrder, setExportOrder] = useState();
  const [listConsignment, setListConsignment] = useState([]);
  const [openPopup, setOpenPopup] = useState(false);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [isConfirm, setIsConfirm] = useState(false);
  const pages = [5, 10, 15];
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(pages[page]);
  const [totalRecord, setTotalRecord] = useState(0);
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
  const handleOnClickConfirm = () => {
    setTitle("Bạn có chắc chắn muốn xác nhận xuất hàng thành công?");
    setMessage("Hãy kiểm tra kỹ hàng hóa trước khi xác nhận.");
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
      console.log('Xác nhận');
      try {
        const confirmUserId = AuthService.getCurrentUser().id;
        const params = { 
          orderId:exportOrderId, 
          confirmBy:confirmUserId 
        };
        const result = await ExportOrderService.confirmExportOrder(params);
        //const result = unwrapResult(actionResult);
        console.log(result);
        if (!!result) {
          if (!!result.message) {
            toast.success(result.message);
          } else {
            toast.success('Xác nhận xuất kho thành công!');
          }
          fetchExportOrderDetail();
          //fetchConsignmentsByExportOrderId();
          setOpenPopup(false);
        }
      } catch (error) {
        console.log('Failed to confirm importOder: ', error);
        if (error.message) {
          toast.error(error.message);
        } else {
          toast.error('Lỗi! Xác nhận xuất kho thất bại!');
        }
      }
    } else {
      console.log('Huỷ');
      try {
        const confirmUserId = AuthService.getCurrentUser().id;
        const params = { 
          orderId:exportOrderId, 
          confirmBy:confirmUserId 
        };
        const result = await ExportOrderService.cancelExportOrder(params);
        //const result = unwrapResult(actionResult);
        console.log(result);
        if (!!result) {
          if (!!result.message) {
            toast.success(result.message);
          } else {
            toast.success('Huỷ xuất kho thành công!');
          }
          fetchExportOrderDetail();
          //fetchConsignmentsByExportOrderId();
          setOpenPopup(false);
        }
      } catch (error) {
        console.log('Failed to cancel importOder: ', error);
        if (error.message) {
          toast.error(error.message);
        } else {
          toast.error('Lỗi! Huỷ xuất kho thất bại!');
        }
      }
    }
  };
  const fetchExportOrderDetail = async () => {
    try {
      const dataResult = await ExportOrderService.getExportOrderById(
        exportOrderId
      );
      //const dataResult = unwrapResult(actionResult);
      if (
        dataResult.data &&
        !FormatDataUtils.isEmptyObject(dataResult.data.listExportProduct)
      ) {
        setExportOrder(dataResult.data.listExportProduct);
        console.log(dataResult.data.listExportProduct);
      } else {
        navigate("/404");
      }
      console.log("Export Order Detail", dataResult);
    } catch (error) {
      console.log("Failed to fetch exportOrder detail: ", error);
    }
  };
  // const fetchConsignmentsByExportOrderId = async () => {
  //   try {
  //     const dataResult = await ExportOrderService.getExportOrderById(exportOrderId);
  //     //const dataResult = unwrapResult(actionResult);
  //     if (dataResult.data) {
  //       setListConsignments(dataResult.data.listExportProduct);
  //       //setAddressWarehouse(dataResult.data.addressWarehouse);
  //       //setTotalRecord(dataResult.data.totalRecord);
  //     }
  //     console.log('consignments List', dataResult.data.listExportProduct);
  //   } catch (error) {
  //     console.log('Failed to fetch consignment list by exportOder: ', error);
  //   }
  // };
  useEffect(() => {
    if (isNaN(exportOrderId)) {
      navigate("/404");
    } else {
      fetchExportOrderDetail();
      //fetchConsignmentsByExportOrderId();
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
                </Box>
                {exportOrder[0].confirm_by == null && (
                  <Stack
                    direction="row"
                    justifyContent="flex-end"
                    spacing={2}
                    className="buttonAction"
                  >
                    {(currentUserRole === "ROLE_ADMIN" ||
                      currentUserRole === "ROLE_USER") && (
                      <Button
                        variant="contained"
                        startIcon={<Done />}
                        color="success"
                        onClick={() => handleOnClickConfirm()}
                      >
                        Xác nhận xuất kho
                      </Button>
                    )}
                    {(currentUserRole === "ROLE_ADMIN" ||
                      currentUserRole === "ROLE_USER") && (
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
                {(exportOrder[0].confirm_by === 'admin' || exportOrder[0].confirm_by === 'user') &&
                exportOrder[0].status_id != 4 &&
                (currentUserRole === 'ROLE_ADMIN' ||
                  currentUserRole === 'ROLE_USER') && (
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
                      onClick={() => navigate(`/export/return/${exportOrderId}`)}
                    >
                      Trả hàng
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
                        {/* <Typography>Ngày tạo đơn:</Typography>
                      <Typography>
                        <i>
                          {exportOrder?.createDate
                            ? FormatDataUtils.formatDateTime(exportOrder.createDate)
                            : null}
                        </i>
                      </Typography> */}
                      </Box>
                      {exportOrder[0].confirm_by !== null && (
                        <Box>
                          <Typography>
                            Người xác nhận:{" "}
                            <i>{"(" + exportOrder[0].confirm_by + ")"}</i>
                          </Typography>
                          <Typography>Ngày xác nhận:</Typography>
                          {/* <Typography>
                          <i>
                            {exportOrder.confirmDate
                              ? FormatDataUtils.formatDateTime(
                                  exportOrder.confirmDate,
                                )
                              : null}
                          </i>
                        </Typography> */}
                        </Box>
                      )}
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
              <Grid xs={12} item>
                <Card>
                  <CardContent className="warehourseInfo">
                    <Typography variant="h6">Kho lấy hàng</Typography>
                    <Stack spacing={2}>
                      {exportOrder.length > 0 &&
                        exportOrder.map((address, index) => (
                          <Box key={index} className="warehouseContainer">
                            <Typography>{address.warehouse_name}</Typography>
                          </Box>
                        ))}
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
        </Grid>
      )}
    </Box>
  );
};

export default ExportOrderDetail;
