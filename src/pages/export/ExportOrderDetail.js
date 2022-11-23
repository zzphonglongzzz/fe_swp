import { useParams, useNavigate } from "react-router-dom";
import { useState,useEffect } from "react";
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
  } from '@mui/material';
import Popup from "../../component/common/dialog";
import { Close, Done, Edit, KeyboardReturn } from '@mui/icons-material';
import ExportProductTable from "./ExportProductTable";

const ExportOrderDetail = () => {
  const { exportOrderId } = useParams();
  const navigate = useNavigate();
  const [exportOrder, setExportOrder] = useState();
  const [listConsignments, setListConsignments] = useState([]);
  const [addressWarehouse, setAddressWarehouse] = useState([]);
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
    if (listConsignments) {
      const productList = listConsignments;
      for (let index = 0; index < productList.length; index++) {
        totalAmount =
          totalAmount + +productList[index]?.quantity * +productList[index]?.unitPrice;
      }
    }
    return totalAmount;
  };
  const handleOnClickConfirm = () => {
    setTitle('Bạn có chắc chắn muốn xác nhận xuất hàng thành công?');
    setMessage('Hãy kiểm tra kỹ hàng hóa trước khi xác nhận.');
    setIsConfirm(true);
    setOpenPopup(true);
  };

  const handleOnClickCancel = () => {
    setTitle('Bạn có chắc chắn muốn hủy phiếu xuất hàng không?');
    setMessage('');
    setIsConfirm(false);
    setOpenPopup(true);
  };
  const handleConfirm = async () => {
    // if (isConfirm) {
    //   console.log('Xác nhận');
    //   try {
    //     const confirmUserId = AuthService.getCurrentUser().id;
    //     const params = { exportOrderId, confirmUserId };
    //     const actionResult = await dispatch(confirmExportOrder(params));
    //     const result = unwrapResult(actionResult);
    //     console.log(result);
    //     if (!!result) {
    //       if (!!result.message) {
    //         toast.success(result.message);
    //       } else {
    //         toast.success('Xác nhận xuất kho thành công!');
    //       }
    //       fetchExportOrderDetail();
    //       fetchConsignmentsByExportOrderId();
    //       setOpenPopup(false);
    //     }
    //   } catch (error) {
    //     console.log('Failed to confirm importOder: ', error);
    //     if (error.message) {
    //       toast.error(error.message);
    //     } else {
    //       toast.error('Lỗi! Xác nhận xuất kho thất bại!');
    //     }
    //   }
    // } else {
    //   console.log('Huỷ');
    //   try {
    //     const confirmUserId = AuthService.getCurrentUser().id;
    //     const params = { exportOrderId, confirmUserId };
    //     const actionResult = await dispatch(cancelExportOrder(params));
    //     const result = unwrapResult(actionResult);
    //     console.log(result);
    //     if (!!result) {
    //       if (!!result.message) {
    //         toast.success(result.message);
    //       } else {
    //         toast.success('Huỷ xuất kho thành công!');
    //       }
    //       fetchExportOrderDetail();
    //       fetchConsignmentsByExportOrderId();
    //       setOpenPopup(false);
    //     }
    //   } catch (error) {
    //     console.log('Failed to cancel importOder: ', error);
    //     if (error.message) {
    //       toast.error(error.message);
    //     } else {
    //       toast.error('Lỗi! Huỷ xuất kho thất bại!');
    //     }
    //   }
    // }
  };
  const fetchExportOrderDetail = async () => {
    // try {
    //   const actionResult = await dispatch(getExportOrderById(exportOrderId));
    //   const dataResult = unwrapResult(actionResult);
    //   if (
    //     dataResult.data &&
    //     !FormatDataUtils.isEmptyObject(dataResult.data.inforExportDetail)
    //   ) {
    //     setExportOrder(dataResult.data.inforExportDetail);
    //   } else {
    //     navigate('/404');
    //   }
    //   console.log('Export Order Detail', dataResult);
    // } catch (error) {
    //   console.log('Failed to fetch exportOrder detail: ', error);
    // }
  };
  const fetchConsignmentsByExportOrderId = async () => {
    // try {
    //   const params = {
    //     orderId: exportOrderId,
    //   };
    //   const actionResult = await dispatch(getConsignmentsByExportOrderId(params));
    //   const dataResult = unwrapResult(actionResult);
    //   if (dataResult.data) {
    //     setListConsignments(dataResult.data.productList);
    //     setAddressWarehouse(dataResult.data.addressWarehouse);
    //     setTotalRecord(dataResult.data.totalRecord);
    //   }
    //   console.log('consignments List', dataResult);
    // } catch (error) {
    //   console.log('Failed to fetch consignment list by exportOder: ', error);
    // }
  };
  useEffect(() => {
    if (isNaN(exportOrderId)) {
      navigate('/404');
    } else {
      fetchExportOrderDetail();
      fetchConsignmentsByExportOrderId();
    }
  }, []);
  return (
    <Box>
    {exportOrder && (
      <Grid
        container
        spacing={2}
      >
        <Grid
          xs={12}
          item
        >
          <Card>
            <Stack
              direction="row"
              justifyContent="space-between"
              p={2}
            >
              <Box className="billReferenceContainer">
                <Typography variant="span">
                  <strong>Phiếu xuất kho số:</strong> {'XUAT' + exportOrderId}
                </Typography>{' '}
                <span>
                  {exportOrder.statusName}
                </span>
              </Box>
              {exportOrder.statusName === 'pending' && (
                <Stack
                  direction="row"
                  justifyContent="flex-end"
                  spacing={2}
                  className="buttonAction"
                >
                  {(currentUserRole === 'ROLE_OWNER' ||
                    currentUserRole === 'ROLE_STOREKEEPER') && (
                    <Button
                      variant="contained"
                      startIcon={<Done />}
                      color="success"
                      onClick={() => handleOnClickConfirm()}
                    >
                      Xác nhận xuất kho
                    </Button>
                  )}
                  {(currentUserRole === 'ROLE_OWNER' ||
                    currentUserRole === 'ROLE_STOREKEEPER') && (
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
              {/* {exportOrder.statusName === 'completed' &&
                exportOrder.isReturn !== true &&
                (currentUserRole === 'ROLE_OWNER' ||
                  currentUserRole === 'ROLE_SELLER') && (
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
                )} */}
            </Stack>
          </Card>
        </Grid>
        <Grid
          xs={9}
          item
        >
          <Grid
            container
            spacing={2}
          >
            <Grid
              xs={12}
              item
            >
              <Card className="cardTable">
                {listConsignments && listConsignments?.length > 0 ? (
                  <ExportProductTable productList={listConsignments} />
                ) : (
                  <Box>Đơn xuất hàng không có lô hàng nào</Box>
                )}
              </Card>
            </Grid>
          </Grid>
        </Grid>
        <Grid
          xs={3}
          item
        >
          <Grid
            container
            spacing={2}
          >
            <Grid
              xs={12}
              item
            >
              <Card>
                <CardContent className="confirmInfo">
                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="h6">Thông tin xác nhận</Typography>
                      <Typography>
                        Người tạo đơn:{' '}
                        <i>
                          {exportOrder.createdFullName +
                            '(' +
                            exportOrder.createBy +
                            ')'}
                        </i>
                      </Typography>
                      <Typography>Ngày tạo đơn:</Typography>
                      <Typography>
                        <i>
                          {exportOrder.createDate
                            ? FormatDataUtils.formatDateTime(exportOrder.createDate)
                            : null}
                        </i>
                      </Typography>
                    </Box>
                    {exportOrder.statusName === 'completed' && (
                      <Box>
                        <Typography>
                          Người xác nhận:{' '}
                          <i>
                            {exportOrder.confirmByFullName +
                              '(' +
                              exportOrder.confirmBy +
                              ')'}
                          </i>
                        </Typography>
                        <Typography>Ngày xác nhận:</Typography>
                        <Typography>
                          <i>
                            {exportOrder.confirmDate
                              ? FormatDataUtils.formatDateTime(
                                  exportOrder.confirmDate,
                                )
                              : null}
                          </i>
                        </Typography>
                      </Box>
                    )}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
            <Grid
              xs={12}
              item
            >
              <Card>
                <CardContent className="warehourseInfo">
                  <Typography variant="h6">Kho lấy hàng</Typography>
                  <Stack spacing={2}>
                    {addressWarehouse.length > 0 &&
                      addressWarehouse.map((address, index) => (
                        <Box
                          key={index}
                          className="warehouseContainer"
                        >
                          <Typography>{address.name}</Typography>
                          <Divider />
                          <Typography>{address.detailAddress}</Typography>
                        </Box>
                      ))}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
            <Grid
              xs={12}
              item
            >
            </Grid>
            <Grid
              xs={12}
              item
            >
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
        <Popup
          maxWidth="sm"
          title={title}
          openPopup={openPopup}
          setOpenPopup={setOpenPopup}
          isConfirm={true}
          handleConfirm={handleConfirm}
        >
          <Box
            component={'span'}
            className="popupMessageContainer"
          >
            {message}
          </Box>
        </Popup>
      </Grid>
    )}
  </Box>
  )
};

export default ExportOrderDetail;
