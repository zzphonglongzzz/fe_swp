import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";
import FormatDataUtils from "../../utils/FormatDataUtils";
import { toast } from "react-toastify";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Close, KeyboardReturn } from "@mui/icons-material";
import { FieldArray, Form, Formik, useField } from "formik";
import AlertPopup from "../../component/common/AlertPopup";
import ExportOrderService from "../../service/ExportOrderService";
import moment from "moment";

const ReturnGoods = () => {
  const { exportOrderId } = useParams();
  const [productList, setProductList] = useState([]);
  const navigate = useNavigate();
  const [openPopup, setOpenPopup] = useState(false);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState();
  const [isConfirm, setIsConfirm] = useState(false);
  //const [listConsignment, setListConsignment] = useState([]);
  const arrayHelpersRef = useRef(null);
  const valueFormik = useRef();
  const errorFormik = useRef();

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
  const FORM_VALIDATION = Yup.object().shape({
    description: Yup.string().max(255, "Mô tả không thể dài quá 255 kí tự"),
  });

  const handleOnClickConfirm = () => {
    setTitle("Bạn có chắc chắn muốn xác nhận trả hàng không?");
    setMessage("");
    setErrorMessage(null);
    setIsConfirm(true);
    if (FormatDataUtils.isEmptyObject(errorFormik.current)) {
      setOpenPopup(true);
    }
  };
  const handleOnClickCancel = () => {
    setTitle("Bạn có chắc chắn muốn hủy trả hàng không?");
    setMessage("");
    setErrorMessage(null);
    setIsConfirm(false);
    setOpenPopup(true);
  };
  const calculateTotalAmount = () => {
    let totalAmout = 0;
    if (valueFormik.current !== undefined) {
      const consignments = valueFormik.current.consignments;
      for (let index = 0; index < consignments.length; index++) {
        totalAmout =
          totalAmout +
          consignments[index].quantityReturn * consignments[index].unit_price;
      }
    }
    return totalAmout;
  };
  const handleConfirm = async () => {
    if (isConfirm) {
      const values = valueFormik.current;
      let productList = values.consignments;
      let consignmentProductDTOs = [];
      for (let index = 0; index < productList.length; index++) {
        if (productList[index].quantityReturn > productList[index].quantity) {
          setErrorMessage(
            "Bạn không thể nhập số lượng lớn hơn số lượng phiếu xuất hàng"
          );
          setOpenPopup(true);
          return;
        }
        if (productList.quantityReturn < 0) {
          setErrorMessage("Bạn không thể nhập số lượng nhỏ hơn 0");
          setOpenPopup(true);
          return;
        }
        if (!Number.isInteger(productList[index]?.quantityReturn)) {
          setErrorMessage("Vui lòng nhập số lượng sản phẩm là số nguyên");
          setOpenPopup(true);
          return;
        }
        if (productList[index]?.quantityReturn === "") {
          setErrorMessage("Bạn có sản phẩm chưa nhập số lượng");
          setOpenPopup(true);
          return;
        }
        if (productList[index] > 0) {
          consignmentProductDTOs.push({
            consignmentId: productList[index]?.consignment_id,
            productId: productList[index]?.product_id,
            unitPrice: productList[index]?.unit_price,
            expirationDate: moment(productList[index]?.expiration_date)
              .utc()
              .format("YYYY-MM-DD hh:mm:ss"),
            quantity: productList[index]?.quantityReturn,
            warehouseId: productList[index]?.warehouse_id,
          });
        }
      }
      console.log(consignmentProductDTOs);
      if (consignmentProductDTOs.length > 0) {
        try {
          const resultResponse = await ExportOrderService.createReturnOrder(
            productList[0].order_id,
            productList[0].order_id,
            productList[0].confirm_by_id,
            values.description,
            consignmentProductDTOs
          );
          //const resultResponse = unwrapResult(response);
          console.log(resultResponse);
          if (resultResponse) {
            if (resultResponse.data.message) {
              toast.success(resultResponse.data.message);
            } else {
              toast.success("Tạo phiếu trả hàng thành công");
            }
            console.log(resultResponse);
            navigate(`/export/detail/${exportOrderId}`);
          }
        } catch (error) {
          console.log("Failed to save return order: ", error);
          if (error.message) {
            toast.error(error.message);
          } else {
            toast.error("Lỗi! Trả hàng thất bại!");
          }
        }
      } else {
        setErrorMessage(
          "Bạn không thể trả hàng nếu không có bất kì số lượng trả về nào"
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
      const params = {
        // pageIndex: page,
        // pageSize: rowsPerPage,
        orderId: exportOrderId,
      };
      const dataResult = await ExportOrderService.getExportOrderById(params);
      if (dataResult.data && !FormatDataUtils.isEmptyObject(dataResult.data.listExportProduct)) {
        setProductList(dataResult.data.listExportProduct);
        //console.log(dataResult.data.listExportProduct);
      }else{
        navigate("/404")
      }
    } catch (error) {
      console.log("Failed to fetch consignment list by exportOder: ", error);
    }
  };
  useEffect(() => {
    if (isNaN(exportOrderId)) {
      navigate("/404");
    } else {
      fetchConsignmentsByExportOrderId();
    }
  }, []);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{ consignments: [...productList] }}
        onSubmit={(values) => handleConfirm(values)}
        validationSchema={FORM_VALIDATION}
      >
        {({ values, errors, setFieldValue }) => (
          <Form>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Card>
                  <Stack direction="row" justifyContent="space-between" p={2}>
                    <Box>
                      <Typography variant="span">
                        <strong>Phiếu trả hàng từ phiếu xuất hàng số: </strong>{" "}
                        {"XUAT" + productList[0]?.order_id}
                      </Typography>{" "}
                    </Box>
                    <Stack
                      direction="row"
                      justifyContent="flex-end"
                      spacing={2}
                    >
                      <Button
                        variant="contained"
                        startIcon={<KeyboardReturn />}
                        color="warning"
                        onClick={() => handleOnClickConfirm()}
                      >
                        Trả hàng
                      </Button>
                      <Button
                        variant="contained"
                        startIcon={<Close />}
                        color="error"
                        onClick={() => handleOnClickCancel()}
                      >
                        Huỷ phiếu trả hàng
                      </Button>
                    </Stack>
                  </Stack>
                  {/* )} */}
                </Card>
              </Grid>
              <Grid xs={9} item>
                <Grid container spacing={2}>
                  <Grid xs={12} item>
                    <Card>
                      {!!productList && productList?.length > 0 ? (
                        <Box>
                          <TableContainer component={Paper}>
                            <Table
                              sx={{ minWidth: 200 }}
                              aria-label="customized table"
                            >
                              <TableHead>
                                <TableRow>
                                  <StyledTableCell>STT</StyledTableCell>
                                  <StyledTableCell>Mã sản phẩm</StyledTableCell>
                                  <StyledTableCell>
                                    Tên sản phẩm
                                  </StyledTableCell>
                                  <StyledTableCell>Vị trí</StyledTableCell>
                                  <StyledTableCell>Đơn vị</StyledTableCell>
                                  <StyledTableCell>Đơn giá</StyledTableCell>
                                  <StyledTableCell>Trả về</StyledTableCell>
                                  <StyledTableCell align="center">
                                    Số lượng trên đơn hàng
                                  </StyledTableCell>
                                  <StyledTableCell>Thành tiền</StyledTableCell>
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
                                          (consignment, index) =>
                                            
                                              <TableRow
                                                hover
                                                key={index}
                                                //   selected={islistConsignmentselected}
                                                selected={false}
                                              >
                                                <TableCell>
                                                  {index + 1}
                                                </TableCell>
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
                                                  {consignment?.unit_price}
                                                </TableCell>
                                                <TableCell>
                                                  <TextfieldWrapper
                                                    name={`consignments[${index}].quantityReturn`}
                                                    variant="standard"
                                                    className="text-field-quantityReturn"
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
                                                <TableCell align="center">
                                                  {consignment?.quantity}
                                                </TableCell>
                                                <TableCell>
                                                  {FormatDataUtils.formatCurrency(
                                                    values.consignments[index]
                                                      .quantityReturn *
                                                      values.consignments[index]
                                                        .unit_price || 0
                                                  )}
                                                </TableCell>
                                              </TableRow>
                                            
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
                </Grid>
              </Grid>
              <Grid xs={3} item>
                <Grid container spacing={2}>
                  <Grid xs={12} item>
                    <Card>
                      {/* <CardContent>
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
                    </CardContent> */}
                    </Card>
                  </Grid>
                  <Grid xs={12} item>
                    <Card>
                      <CardContent>
                        <Typography variant="h6">Ghi chú</Typography>
                        <TextfieldWrapper
                          id="description"
                          name="description"
                          variant="outlined"
                          multiline
                          rows={6}
                          fullWidth
                        />
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
              </Grid>
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

export default ReturnGoods;
