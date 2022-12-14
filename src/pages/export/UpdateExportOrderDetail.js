import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Fragment, useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
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
import moment from "moment";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

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
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));
const UpdateExportOrderDetail = () => {
  const { exportOrderId } = useParams();
  const navigate = useNavigate();
  //const [exportOrder, setExportOrder] = useState();
  const [productList, setProductList] = useState([]);
  //const [addressWarehouse, setAddressWarehouse] = useState([]);
  const [openPopup, setOpenPopup] = useState(false);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState();
  const [isConfirm, setIsConfirm] = useState(false);
  const arrayHelpersRef = useRef(null);
  const valueFormik = useRef();
  const errorFormik = useRef();

  const calculateTotalQuantityOfProduct = (product) => {
    let totalQuantity = 0;
    if (
      product.consignmentList !== undefined &&
      product.consignmentList?.length > 0
    ) {
      product?.consignmentList.forEach((consignment) => {
        totalQuantity = +totalQuantity + +consignment.quantity;
      });
    }
    return FormatDataUtils.getRoundFloorNumber(totalQuantity, 2);
  };
  const handleOnClickConfirm = () => {
    setTitle("B???n c?? ch???c ch???n mu???n l??u l???i ch???nh s???a kh??ng?");
    setMessage("H??y ki???m tra k??? th??ng tin tr?????c khi x??c nh???n.");
    setErrorMessage(null);
    setIsConfirm(true);
    if (FormatDataUtils.isEmptyObject(errorFormik.current)) {
      setOpenPopup(true);
    }
  };
  const handleOnClickCancel = () => {
    setTitle("B???n c?? ch???c ch???n mu???n h???y t???t c??? nh???ng ch???nh s???a kh??ng?");
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
          +listConsignments[index]?.quantity *
            +listConsignments[index]?.unit_price;
      }
    }
    return totalAmount;
  };
  const handleConfirm = async () => {
    if (isConfirm) {
      const values = valueFormik.current;
      let consignmentProductDTOList = [];
      if (values.consignments) {
        for (let index = 0; index < values.consignments.length; index++) {
          const consignment = values.consignments[index];
          if (consignment.quantity === "") {
            setErrorMessage("B???n c?? s???n ph???m ch??a nh???p s??? l?????ng");
            setOpenPopup(true);
            return;
          }
          if (consignment.quantity <= 0) {
            setErrorMessage("Vui l??ng nh???p s???n ph???m v???i s??? l?????ng l???n h??n 0");
            setOpenPopup(true);
            return;
          }
          if (!Number.isInteger(consignment.quantity)) {
            setErrorMessage("Vui l??ng nh???p s??? l?????ng s???n ph???m l?? s??? nguy??n");
            setOpenPopup(true);
            return;
          }
          if (consignment.quantity > consignment.quantity_sale) {
            setErrorMessage(
              "Vui l??ng nh???p s??? l?????ng nh??? h??n s??? l?????ng trong kho"
            );
            setOpenPopup(true);
            return;
          }
          if (consignment.quantity > 0) {
            consignmentProductDTOList.push({
              consignmentId: consignment.consignment_id,
              productId: consignment.product_id,
              expirationDate: moment(consignment.expiration_date)
                .utc()
                .format("YYYY-MM-DD hh:mm:ss"),
              quantity: Math.round(consignment.quantity),
              unitPrice: Math.round(consignment.unit_price),
            });
          }
        }
      }
      if (consignmentProductDTOList.length > 0) {
        try {
          const resultResponse = await ExportOrderService.updateExportOrder(
            exportOrderId,
            consignmentProductDTOList
          );
          console.log(resultResponse);
          if (resultResponse) {
            if (resultResponse.data.message) {
              toast.success(resultResponse.data.message);
            } else {
              toast.success("S???a phi???u xu???t h??ng th??nh c??ng");
            }
            console.log(resultResponse);
            navigate(`/export/detail/${exportOrderId}`);
          }
        } catch (error) {
          console.log("Failed to save export order: ", error);
          toast.error("S???a phi???u xu???t h??ng th???t b???i");
        }
      } else {
        setErrorMessage(
          "B???n kh??ng c?? l?? h??ng n??o tho??? m??n ??i???u ki???n xu???t h??ng"
        );
        setOpenPopup(true);
        return;
      }
    } else {
      console.log("Hu???");
      navigate(`/export/detail/${exportOrderId}`);
    }
  };
  // const fetchExportOrderDetail = async () => {
  //   try {
  //     // const params = {
  //     //   orderId: importOrderId,
  //     // };
  //     const dataResult = await dispatch(getExportOrderById(exportOrderId));
  //     if (
  //       dataResult.data &&
  //       !FormatDataUtils.isEmptyObject(dataResult.data.inforExportDetail)
  //     ) {
  //       setExportOrder(dataResult.data.inforExportDetail);

  //       if (dataResult.data.inforExportDetail?.statusName !== "pending") {
  //         navigate(`/export/detail/${exportOrderId}`);
  //       }
  //     } else {
  //       navigate("/404");
  //     }
  //     console.log("Export Order Detail", dataResult);
  //   } catch (error) {
  //     console.log("Failed to fetch exportOrder detail: ", error);
  //   }
  // };
  const fetchConsignmentsByExportOrderId = async () => {
    try {
      const params = {
        orderId: exportOrderId,
      };
      const dataResult = await ExportOrderService.getExportOrderById(params);
      if (
        dataResult.data &&
        !FormatDataUtils.isEmptyObject(dataResult.data.listExportProduct)
      ) {
        setProductList(dataResult.data.listExportProduct);
      } else {
        navigate("/404");
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
      >
        {({ values, errors, setFieldValue }) => (
          <Form>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Card>
                  <Stack direction="row" justifyContent="space-between" p={2}>
                    <Box className="billReferenceContainer">
                      <Typography variant="span">
                        <strong>Phi???u xu???t h??ng s???:</strong>
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
                        startIcon={<Edit />}
                        color="warning"
                        onClick={() => handleOnClickConfirm()}
                      >
                        L??u ch???nh s???a
                      </Button>
                      <Button
                        variant="contained"
                        startIcon={<Close />}
                        color="error"
                        onClick={() => handleOnClickCancel()}
                      >
                        Hu??? ch???nh s???a
                      </Button>
                    </Stack>
                  </Stack>
                </Card>
              </Grid>
              <Grid xs={9} item>
                <Grid container spacing={2}>
                  {/* <Grid xs={12} item>
                    <Card>
                      <CardContent>
                        <Typography variant="h6">
                          Th??ng tin nh?? cung c???p
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
                                  <StyledTableCell>M?? s???n ph???m</StyledTableCell>
                                  <StyledTableCell>
                                    T??n s???n ph???m
                                  </StyledTableCell>
                                  <StyledTableCell>????n v???</StyledTableCell>
                                  <StyledTableCell>S??? l?????ng</StyledTableCell>
                                  <StyledTableCell>
                                    S??? l?????ng trong kho
                                  </StyledTableCell>
                                  <StyledTableCell>????n gi??</StyledTableCell>
                                  <StyledTableCell>Th??nh ti???n</StyledTableCell>
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
                                                {consignment?.unit_measure}
                                              </TableCell>
                                              <TableCell>
                                                <TextfieldWrapper
                                                  name={`consignments[${index}].quantity`}
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
                                                {consignment?.quantity_sale}
                                              </TableCell>
                                              <TableCell>
                                                {consignment?.unit_price}
                                              </TableCell>
                                              <TableCell>
                                                {FormatDataUtils.formatCurrency(
                                                  values.consignments[index]
                                                    .quantity *
                                                    values.consignments[index]
                                                      .unit_price
                                                )}
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
                        <Box> Phi???u nh???p ch??a c?? l?? h??ng n??o </Box>
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
                        <Typography variant="h6">Th??ng tin x??c nh???n</Typography>
                        <br />
                        <Typography>
                          Ng?????i t???o ????n:{" "}
                          <i>{"(" + listConsignments[0]?.creator + ")"}</i>
                        </Typography>
                        <Typography>Ng??y t???o ????n:</Typography>
                        <Typography>
                          {FormatDataUtils.formatDateTime(
                            listConsignments[0]?.createDate
                          )}
                        </Typography>
                        <br />
                        {listConsignments[0]?.confirmDate && (
                          <Box>
                            <Typography>
                              Ng?????i x??c nh???n:{" "}
                              <i>
                                {"(" + listConsignments[0]?.confirm_by + ")"}
                              </i>
                            </Typography>
                            <Typography>Ng??y x??c nh???n:</Typography>
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
                        <Typography variant="h6">
                          T???ng gi?? tr??? ????n h??ng
                        </Typography>
                        <br />
                        <Typography align="right">
                          {FormatDataUtils.formatCurrency(
                            calculateTotalAmount()
                          )}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Grid>
              <AlertPopup
                maxWidth="sm"
                title={errorMessage ? "Ch?? ??" : title}
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

export default UpdateExportOrderDetail;
