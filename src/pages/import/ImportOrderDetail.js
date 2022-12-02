import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./ImportOrderDetail.scss";
import AuthService from "../../service/AuthService";
import FormatDataUtils from "../../utils/FormatDataUtils";
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  Link,
  Stack,
  Typography,
} from "@mui/material";
import { toast } from "react-toastify";
import { Close, Done, Edit } from "@mui/icons-material";
import CustomTablePagination from "../../component/common/Pagination/index";
import ConsignmentsTable from "./ConsignmentsTable";
import importOrderService from "../../service/ImportOrderService";
import AlertPopup from "../../component/common/AlertPopup/index";
import Label from "../../component/common/Label";

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
      text: "Đã đã trả hàng",
      color: "primary",
    },
  };

  const { text, color } = map[exportOrderStatus];

  return <Label color={color}>{text}</Label>;
};
const ImportOrderDetail = () => {
  const { importOrderId } = useParams();
  const [importOrder, setImportOrder] = useState();
  const [listConsignments, setListConsignments] = useState([]);
  const [openPopup, setOpenPopup] = useState(false);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [isConfirm, setIsConfirm] = useState(false);
  const [createdDate] = useState(new Date().getTime());
  const [confirmedDate] = useState(new Date().getTime());
  const pages = [5, 10, 20];
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(pages[page]);
  const [totalRecord, setTotalRecord] = useState(0);
  const navigate = useNavigate();
  const currentUserRole = AuthService.getCurrentUser().roles[0];
  //const confirmUserId = AuthService.getCurrentUser().id;
  console.log(importOrderId);
  //console.log(confirmUserId);

  
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const calculateTotalAmount = () => {
    let totalAmount = 0;
    if (importOrder !== undefined && importOrder?.length > 0) {
     // console.log(listConsignments);
      for (let index = 0; index < importOrder.length; index++) {
        totalAmount =
          totalAmount +
          +importOrder[index]?.quantity * +importOrder[index]?.unit_price;
      }
      return totalAmount;
    }
  };
  const handleOnClickConfirm = () => {
    setTitle("Bạn có chắc chắn muốn xác nhận rằng nhập kho thành công?");
    setMessage("Hãy kiểm tra kỹ hàng hóa trước khi xác nhận.");
    setIsConfirm(true);
    setOpenPopup(true);
  };

  const handleOnClickEdit = () => {
    navigate(`/import/edit/${importOrderId}`);
  };

  const handleOnClickCancel = () => {
    setTitle("Bạn có chắc chắn muốn hủy phiếu nhập này không?");
    setMessage("");
    setIsConfirm(false);
    setOpenPopup(true);
  };
  const fetchImportOrderDetail = async () => {
    try {
      const params = {
        orderId: importOrderId,
      };
      const dataResult = await importOrderService.getImportOrderById(params);
      //const dataResult = unwrapResult(actionResult);
      if (
        dataResult.data.listImportProduct &&
        !FormatDataUtils.isEmptyObject(dataResult.data.listImportProduct)
      ) {
        setImportOrder(dataResult.data.listImportProduct);
        console.log(dataResult.data.listImportProduct);
      } else {
        navigate("/404");
      }
      console.log("Import Order Detail", dataResult);
    } catch (error) {
      console.log("Failed to fetch importOrder detail: ", error);
    }
  };
  // const fetchProductListByImportOrderId = async () => {
  //   try {
  //     const params = {
  //       // pageIndex: page,
  //       // pageSize: rowsPerPage,
  //       orderId: importOrderId,
  //     };
  //     const actionResult = await dispatch(getProductByImportOrderId(params));
  //     const dataResult = unwrapResult(actionResult);
  //     if (dataResult.data) {
  //       setListConsignments(dataResult.data.listProduct);
  //       setTotalRecord(dataResult.data.totalRecord);
  //       console.log('totalRecord', dataResult.data.totalRecord);
  //     }
  //     console.log('Product List', dataResult);
  //   } catch (error) {
  //     console.log('Failed to fetch product list by importOder: ', error);
  //   }
  // };
  const handleConfirm = async () => {
    if (isConfirm) {
      console.log("Xác nhận");
      try {
        const confirmUserId = AuthService.getCurrentUser().id;
        const params = {
          orderId: importOrderId,
          confirmBy: confirmUserId,
        };
        const result = await importOrderService.confirmImportOrder(
          params
        );
        // const result = unwrapResult(actionResult);
        if (!!result) {
          if (!!result.message) {
            toast.success(result.message);
          } else {
            toast.success("Xác nhận nhập kho thành công!");
          }
          fetchImportOrderDetail();
          // fetchProductListByImportOrderId();
          setOpenPopup(false);
        }
      } catch (error) {
        console.log("Failed to confirm importOder: ", error);
        if (error.message) {
          toast.error(error.message);
        } else {
          toast.error("Lỗi! Xác nhận nhập kho thất bại!");
        }
      }
    } else {
      console.log("Huỷ");
      try {
        const confirmUserId = AuthService.getCurrentUser().id;
        const params = {
          orderId: importOrderId,
          confirmBy: confirmUserId,
        };
        const result = await importOrderService.cancelImportOrder(params);
        // const result = unwrapResult(actionResult);
        if (!!result) {
          if (!!result.message) {
            toast.success(result.message);
          } else {
            toast.success("Huỷ nhập kho thành công!");
          }
          fetchImportOrderDetail();
          // fetchProductListByImportOrderId();
          setOpenPopup(false);
        }
      } catch (error) {
        console.log("Failed to cancel importOder: ", error);
        if (error.message) {
          toast.error(error.message);
        } else {
          toast.error("Lỗi! Huỷ nhập kho thất bại!");
        }
      }
    }
  };
 
  useEffect(() => {
    if (isNaN(importOrderId)) {
      navigate("/404");
    } else {
      fetchImportOrderDetail();
      //fetchProductListByImportOrderId();
    }
  }, [page, rowsPerPage]);

  return (
    <>
      {importOrder && (
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Card>
              <Stack direction="row" justifyContent="space-between" p={2}>
                <Box className="billReferenceContainer">
                  <Typography variant="span">
                    <strong>Phiếu nhập kho số:</strong> {"NHAP" + importOrderId}
                  </Typography>{" "}
                  {/* <span>
                        {getStatusLabel(importOrder[0].status_id)}
                  </span> */}
                </Box>
                {importOrder[0].confirm_by == null && (
                  <Stack
                    direction="row"
                    justifyContent="flex-end"
                    spacing={2}
                    className="buttonAction"
                  >
                    {(currentUserRole === "ROLE_ADMIN" ) && (
                      <Button
                        variant="contained"
                        startIcon={<Done />}
                        color="success"
                        onClick={() => handleOnClickConfirm()}
                      >
                        Xác nhận nhập kho
                      </Button>
                    )}
                    {(currentUserRole === "ROLE_ADMIN" ) && (
                      <Button
                        variant="contained"
                        startIcon={<Edit />}
                        color="warning"
                        onClick={() => handleOnClickEdit()}
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
                      Huỷ phiếu nhập kho
                    </Button>
                  </Stack>
                )}
              </Stack>
            </Card>
          </Grid>
          <Grid xs={9} item>
            <Grid container spacing={2}>
              <Grid xs={12} item>
                <Card>
                  <CardContent>
                    <Typography variant="h6">Thông tin nhà cung cấp</Typography>
                    <Box className="manufacturer-info">
                      <Link
                        href={`/manufacturer/detail/${importOrder[0].manufacturer_name}`}
                        underline="none"
                      >
                        {importOrder[0].manufacturer_name}
                      </Link>
                    </Box>
                    <br />
                    <Divider />
                    <br />
                    <Typography variant="h6">Thông tin lưu kho</Typography>
                    <Typography>
                      Vị trí: {importOrder[0].warehouse_name}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid xs={12} item>
                <Card className="cardTable">
                  {!!importOrder && importOrder.length > 0 ? (
                    <Box>
                      <ConsignmentsTable listConsignments={importOrder} />
                      {totalRecord > 10 && (
                        <CustomTablePagination
                          page={page}
                          pages={pages}
                          rowsPerPage={rowsPerPage}
                          totalRecord={totalRecord}
                          handleChangePage={handleChangePage}
                          handleChangeRowsPerPage={handleChangeRowsPerPage}
                        />
                      )}
                    </Box>
                  ) : (
                    <Box> Phiếu nhập chưa có lô hàng nào </Box>
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
                    <Typography variant="h6">Thông tin xác nhận</Typography>
                    <Typography>
                      Người tạo đơn: <i>{"(" + importOrder[0].creator + ")"}</i>
                    </Typography>
                    {/* <Typography>Ngày tạo đơn:</Typography> */}
                    {/* <Typography>
                          {FormatDataUtils.formatDateTime(importOrder.createDate)}
                        </Typography> */}

                    {importOrder.confirm_by && (
                      <Box>
                        <br />
                        <Typography>
                          Người xác nhận:{" "}
                          <i>
                            {importOrder[0].confirm_by_id +
                              "(" +
                              importOrder[0].confirm_by +
                              ")"}
                          </i>
                        </Typography>
                        <Typography>Ngày xác nhận:</Typography>
                        <Typography>
                          {FormatDataUtils.formatDateTime(
                            importOrder.confirmDate
                          )}
                        </Typography>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
            <Grid xs={12} item>
              <Card>
                <CardContent>
                  <Typography variant="h6">Tổng giá trị đơn hàng</Typography>
                  <Typography align="left">
                    {FormatDataUtils.formatCurrency(calculateTotalAmount())}
                  </Typography>
                </CardContent>
              </Card>
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
    </>
  );
};

export default ImportOrderDetail;
