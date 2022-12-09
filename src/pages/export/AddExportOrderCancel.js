import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Fragment, useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  IconButton,
  Stack,
  Typography,
  TextField,
} from "@mui/material";
import FormatDataUtils from "../../utils/FormatDataUtils";
import { Close, Edit } from "@mui/icons-material";
import { Form, Formik, useField, FieldArray } from "formik";
import * as Yup from "yup";
import ExportOrderService from "../../service/ExportOrderService";
import "./UpdateExportTable.scss";
import AlertPopup from "../../component/common/AlertPopup/index";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";


const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));
const TextfieldWrapper = ({ name, ...otherProps }) => {
  const [field, meta] = useField(name);

  const configTextfield = {
    ...field,
    ...otherProps,
  };

  if (meta && meta.touched && meta.error) {
    configTextfield.error = true;
    configTextfield.helperText = meta.error;
  }
  return <TextField {...configTextfield} />;
};
const AddExportOrderCancel = () => {
  const { exportOrderId } = useParams();
  const navigate = useNavigate();
  const [productList, setProductList] = useState([]);
  const [openPopup, setOpenPopup] = useState(false);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState();
  const [isConfirm, setIsConfirm] = useState(false);
  const arrayHelpersRef = useRef(null);
  const valueFormik = useRef();
  const errorFormik = useRef();

  const handleOnClickConfirm = () => {
    setTitle("Bạn có chắc chắn muốn hủy xuất hàng không?");
    setMessage("Hãy kiểm tra kỹ thông tin trước khi xác nhận.");
    setErrorMessage(null);
    setIsConfirm(true);
    if (FormatDataUtils.isEmptyObject(errorFormik.current)) {
      setOpenPopup(true);
    }
  };
  const handleOnClickCancel = () => {
    setTitle("Bạn có chắc chắn muốn hủy tất cả những chỉnh sửa không?");
    setMessage("");
    setIsConfirm(false);
    setOpenPopup(true);
  };
  const calculateTotalAmount = () => {
    let totalAmount = 0;
    const listConsignments = valueFormik.current?.consignments;
    if (listConsignments !== undefined && listConsignments?.length > 0) {
      for (let index = 0; index < listConsignments.length; index++) {
        totalAmount =
          totalAmount +
          +listConsignments[index]?.damagedQuantity *
            +listConsignments[index]?.unit_price;
      }
    }
    return totalAmount;
  };
  const handleConfirm = async () => {
    if (isConfirm) {
      const values = valueFormik.current;
      let orderStatusDeliverDTOS = [];
      if (values.consignments) {
        for (let index = 0; index < values.consignments.length; index++) {
          const consignment = values.consignments[index];
          if (consignment.damagedQuantity === "") {
            setErrorMessage("Bạn có sản phẩm chưa nhập số lượng");
            setOpenPopup(true);
            return;
          }
          if (consignment.damagedQuantity <= 0) {
            setErrorMessage("Vui lòng nhập sản phẩm với số lượng lớn hơn 0");
            setOpenPopup(true);
            return;
          }

          if (!Number.isInteger(consignment.damagedQuantity)) {
            setErrorMessage("Vui lòng nhập số lượng sản phẩm là số nguyên");
            setOpenPopup(true);
            return;
          }

          if (consignment.damagedQuantity > consignment.quantity) {
            setErrorMessage(
              "Vui lòng nhập số lượng nhỏ hơn số lượng trong kho"
            );
            setOpenPopup(true);
            return;
          }

          if (consignment.quantity > 0) {
            orderStatusDeliverDTOS.push({
              description: consignment.description,
              consignmentId: consignment.consignment_id,
              productId: consignment.product_id,
              quantity: Math.round(consignment.quantity),
              damagedQuantity: Math.round(consignment.damagedQuantity),
            });
          }
        }
      }
      console.log(orderStatusDeliverDTOS);
        if (orderStatusDeliverDTOS.length > 0) {
          try {
            const resultResponse = await ExportOrderService.cancelDeliveredOrder(
              exportOrderId,
              orderStatusDeliverDTOS
            );
            console.log(resultResponse);
            if (resultResponse) {
              if (resultResponse.data.message) {
                toast.success(resultResponse.data.message);
              } else {
                toast.success("Sửa phiếu xuất hàng thành công");
              }
              console.log(resultResponse);
              navigate(`/export/detail/${exportOrderId}`);
            }
          } catch (error) {
            console.log("Failed to save export order: ", error);
            toast.error("Sửa phiếu xuất hàng thất bại");
          }
        } else {
          setErrorMessage(
            "Bạn không có lô hàng nào thoả mãn điều kiện xuất hàng"
          );
          setOpenPopup(true);
          return;
        }
      } else {
        console.log("Huỷ");
        navigate(`/export/detail/${exportOrderId}`);
      }
  };
  const fetchConsignmentsByExportOrderId = async () => {
    try {
      const dataResult =
        await ExportOrderService.getOrderDetailForCancelDeliveredOrder(
          exportOrderId
        );
      if (dataResult.data) {
        setProductList(dataResult.data.listExportProduct);
      }
      console.log("consignments List", dataResult);
    } catch (error) {
      console.log("Failed to fetch consignment list by exportOder: ", error);
    }
  };
  useEffect(() => {
    if (isNaN(exportOrderId)) {
      navigate("/404");
    } else {
      //fetchExportOrderDetail();
      fetchConsignmentsByExportOrderId();
    }
  }, []);
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{ consignments: [...productList] }}
        onSubmit={(values) => handleConfirm(values)}
      >
        {({ values, errors, setFieldValue }) => (
          <Form>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Card>
                  <Stack direction="row" justifyContent="space-between" p={2}>
                    <Box>
                      <Typography variant="span">
                        <strong>Phiếu xuất kho số: </strong>
                        {"XUAT " + productList[0]?.order_id}
                      </Typography>{" "}
                      {/* <span>
                              {FormatDataUtils.getStatusLabel(listConsignments.statusName)}
                            </span> */}
                    </Box>
                    {/* {importOrder[0].confirm_by == null && ( */}
                    <Stack
                      direction="row"
                      justifyContent="flex-end"
                      spacing={2}
                    >
                      <Button
                        variant="contained"
                        startIcon={<Edit />}
                        color="warning"
                        onClick={() => handleOnClickConfirm()}
                      >
                        Hủy xuất hàng
                      </Button>
                      <Button
                        variant="contained"
                        startIcon={<Close />}
                        color="error"
                        onClick={() => handleOnClickCancel()}
                      >
                        Huỷ chỉnh sửa
                      </Button>
                    </Stack>
                    {/* )} */}
                  </Stack>
                </Card>
              </Grid>
              <Grid xs={12} item>
                {/* <Grid xs={12} item>
                    <Card>
                      <CardContent>
                        <Typography variant="h6">
                          Thông tin nhà cung cấp
                        </Typography>
                        <Box className="manufacturer-info">
                          {listConsignments[0]?.manufactorName}
                        </Box>
                        <br />
                        <Divider />
                        <br />
                        <Typography variant="h6"></Typography>
                        <br />
                        <Box className="selectbox-warehouse">
                          {listConsignments[0]?.warehouse_name}
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid> */}
                <Grid xs={20} item>
                  <Card>
                    {!!productList && productList?.length > 0 ? (
                      <Box>
                        <TableContainer component={Paper}>
                          <Table sx={{ minWidth: 200 }} aria-label="customized table">
                            <TableHead>
                              <TableRow>
                                <StyledTableCell>STT</StyledTableCell>
                                <StyledTableCell>Mã sản phẩm</StyledTableCell>
                                <StyledTableCell>Tên sản phẩm</StyledTableCell>
                                <StyledTableCell>Vị trí</StyledTableCell>
                                <StyledTableCell>Đơn vị</StyledTableCell>
                                <StyledTableCell>Số lượng bị lỗi</StyledTableCell>
                                <StyledTableCell>Số lượng</StyledTableCell>
                                <StyledTableCell>Đơn giá</StyledTableCell>
                                <StyledTableCell>Thành tiền</StyledTableCell>
                                <StyledTableCell align="center">
                                  Mô tả chi tiết
                                </StyledTableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              <FieldArray
                                name="consignments"
                                render={(arrayHelpers) => {
                                  arrayHelpersRef.current = arrayHelpers;
                                  valueFormik.current = values;
                                  errorFormik.current = errors;
                                  return (
                                    <>
                                      {values.consignments.map(
                                        (consignment, index) => (
                                          <TableRow
                                            hover
                                            key={index}
                                            //   selected={islistConsignmentselected}
                                            selected={false}
                                          >
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell>
                                              {consignment?.product_code}
                                            </TableCell>
                                            <TableCell>
                                              {consignment?.product_name}
                                            </TableCell>
                                            <TableCell>
                                              {consignment?.warehouse_name}
                                            </TableCell>
                                            <TableCell>
                                              {consignment?.unit_measure}
                                            </TableCell>
                                            <TableCell>
                                              <TextfieldWrapper
                                                name={`consignments[${index}].damagedQuantity`}
                                                variant="standard"
                                                className="text-field-quantity"
                                                type={"number"}
                                                InputProps={{
                                                  inputProps: {
                                                    min: 0,
                                                    max: consignment?.quantity,
                                                    step: 1,
                                                  },
                                                }}
                                              />
                                            </TableCell>
                                            <TableCell>
                                              {consignment?.quantity}
                                            </TableCell>
                                            <TableCell>
                                              {FormatDataUtils.formatCurrency(
                                                consignment?.unit_price
                                              )}
                                            </TableCell>
                                            <TableCell>
                                              {FormatDataUtils.formatCurrency(
                                                values.consignments[index]
                                                  .damagedQuantity *
                                                  values.consignments[index]
                                                    .unit_price
                                                    || 0) }
                                            </TableCell>

                                            <TableCell align="center">
                                              <Stack
                                                direction="row"
                                                justifyContent="center"
                                              >
                                                <TextfieldWrapper
                                                  name={`consignments[${index}].description`}
                                                  aria-label="minimum height"
                                                  minRows={3}
                                                  style={{ width: 300 }}
                                                />
                                              </Stack>
                                            </TableCell>
                                          </TableRow>
                                        )
                                      )}
                                    </>
                                  );
                                }}
                              />
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </Box>
                    ) : (
                      <Box> Phiếu nhập chưa có lô hàng nào </Box>
                    )}
                  </Card>
                </Grid>
                <Grid xs={12} item>
                  <Card>
                    <CardContent>
                      <Typography variant="h6">
                        Tổng giá trị đơn hàng
                      </Typography>
                      <br />
                      <Typography align="right">
                        {FormatDataUtils.formatCurrency(
                          calculateTotalAmount() || 0
                        )}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
              {/* <Grid xs={3} item>
                <Grid container spacing={2}>
                  <Grid xs={12} item>
                    <Card>
                      <CardContent>
                        <Typography variant="h6">Thông tin xác nhận</Typography>
                        <br />
                        <Typography>
                          Người tạo đơn:{" "}
                          <i>{"(" + listConsignments[0]?.creator + ")"}</i>
                        </Typography>
                        <Typography>Ngày tạo đơn:</Typography>
                        <Typography>
                          {FormatDataUtils.formatDateTime(
                            listConsignments[0]?.createDate
                          )}
                        </Typography>
                        <br />
                        {listConsignments[0]?.confirmDate && (
                          <Box>
                            <Typography>
                              Người xác nhận:{" "}
                              <i>
                                {"(" + listConsignments[0]?.confirm_by + ")"}
                              </i>
                            </Typography>
                            <Typography>Ngày xác nhận:</Typography>
                            <Typography>
                              {FormatDataUtils.formatDateTime(
                                listConsignments[0]?.confirmDate
                              )}
                            </Typography>
                          </Box>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid xs={12} item>
                    <Card>
                      <CardContent>
                        <Typography variant="h6">
                          Tổng giá trị đơn hàng
                        </Typography>
                        <br />
                        <Typography align="right">
                          {FormatDataUtils.formatCurrency(
                            calculateTotalAmount() || 0
                          )}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Grid> */}
              <AlertPopup
                maxWidth="sm"
                title={errorMessage ? "Chú ý" : title}
                openPopup={openPopup}
                setOpenPopup={setOpenPopup}
                isConfirm={!errorMessage}
                handleConfirm={handleConfirm}
              >
                <Box component={"span"} className="popupMessageContainer">
                  {errorMessage ? errorMessage : message}
                </Box>
              </AlertPopup>
            </Grid>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default AddExportOrderCancel;
