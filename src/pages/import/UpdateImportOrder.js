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
import { Close, Edit } from "@mui/icons-material";
import { FieldArray, Form, Formik, useField } from "formik";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { vi } from "date-fns/locale";
import importOrderService from "../../service/ImportOrderService";
import AlertPopup from "../../component/common/AlertPopup";
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
const UpdateImportOrder = () => {
  const { importOrderId } = useParams();
  //const [importOrder, setImportOrder] = useState();
  const [listConsignments, setListConsignments] = useState([]);
  const [openPopup, setOpenPopup] = useState(false);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [isConfirm, setIsConfirm] = useState(false);
  const [errorMessage, setErrorMessage] = useState();
  //const [selectedWarehouse, setSelectedWarehouse] = useState();
  const pages = [10, 20, 50];
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(pages[page]);
  //const [warehouseList, setWarehouseList] = useState([]);
  const navigate = useNavigate();
  const today = new Date();
  const arrayHelpersRef = useRef(null);
  const valueFormik = useRef();
  const errorFormik = useRef();

  // const FORM_VALIDATION = Yup.object().shape({
  //   // manufactorId: Yup.string().required('B???n ch??a ch???n nh?? cung c???p'),
  //   wareHouseId: Yup.number().required("B???n ch??a ch???n kho ????? nh???p h??ng"),
  //   //description: Yup.string().max(255, 'M?? t??? kh??ng th??? d??i qu?? 255 k?? t???'),
  // });
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
  const handleOnClickConfirm = () => {
    setErrorMessage("");
    setTitle("B???n c?? ch???c ch???n mu???n l??u l???i ch???nh s???a kh??ng?");
    setMessage("H??y ki???m tra k??? th??ng tin tr?????c khi x??c nh???n.");
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
  const handleConfirm = async () => {
    if (isConfirm) {
      const values = valueFormik.current;
      let consignmentRequests = [];
      if (values.consignments) {
        for (let index = 0; index < values.consignments.length; index++) {
          const consignment = values.consignments[index];
          if (consignment.quantity === "" || consignment.unit_price === "") {
            setErrorMessage("B???n c?? s???n ph???m ch??a nh???p s??? l?????ng ho???c ????n gi??");
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

          if (!Number.isInteger(consignment.unit_price)) {
            setErrorMessage("Vui l??ng nh???p ????n gi?? c???a s???n ph???m l?? s??? nguy??n");
            setOpenPopup(true);
            return;
          }

          if (consignment.unit_price < 0) {
            setErrorMessage("Vui l??ng nh???p ????n gi?? l???n h??n ho???c b???ng 0");
            setOpenPopup(true);
            return;
          }

          if (
            new Date(consignment.expiration_date) < new Date() &&
            !!consignment.expiration_date
          ) {
            setErrorMessage("Vui l??ng nh???p h???n l??u kho trong t????ng lai");
            setOpenPopup(true);
            return;
          }

          if (consignment.quantity > 0) {
            consignmentRequests.push({
              consignmentId: consignment.consignment_id,
              productId: consignment.product_id,
              expirationDate: moment(consignment.expiration_date)
                .utc()
                .format("YYYY-MM-DD hh:mm:ss"),
              unitPrice: Math.round(consignment.unit_price),
              quantity: Math.round(consignment.quantity),
            });
          }
        }
      }
      console.log(consignmentRequests);
      if (consignmentRequests.length > 0) {
        console.log("X??c nh???n");
        console.log(consignmentRequests);
        try {
          const actionResult = await importOrderService.updateImportOrder(
            importOrderId,
            consignmentRequests
          );
          // const actionResult = unwrapResult(actionResult);
          if (!!actionResult) {
            if (
              !!actionResult.data.status &&
              actionResult.data.status === 200
            ) {
              toast.success(actionResult.data.message);
            } else {
              toast.success("S???a ????n nh???p kho th??nh c??ng!");
            }
            // fetchImportOrderDetail();
            // fetchProductListByImportOrderId();
            setOpenPopup(false);
            navigate(`/import/detail/${importOrderId}`);
          }
        } catch (error) {
          console.log("Failed to update importOder: ", error);
          if (error.message) {
            toast.error(error.message);
          } else {
            toast.error("S???a phi???u nh???p kho th???t b???i");
          }
        }
      } else {
        // TODO: in ra l???i v?? kh??ng c?? s???n ph???m h???p l???
        console.log(
          "Vui l??ng nh???p s??? l?????ng s???n ph???m tr?????c khi l??u ????n nh???p kho"
        );
        setErrorMessage(
          "Vui l??ng nh???p s??? l?????ng s???n ph???m tr?????c khi l??u ????n nh???p kho"
        );
        setOpenPopup(true);
        return;
      }
    } else {
      console.log("Hu???");
      navigate(`/import/detail/${importOrderId}`);
    }
  };
  // const fetchImportOrderDetail = async () => {
  //   try {
  //     const params = {
  //       orderId: importOrderId,
  //     };
  //     const dataResult = await importOrderService.getImportOrderById(params);
  //     //const dataResult = unwrapResult(actionResult);
  //     if (
  //       dataResult.data.listImportProduct &&
  //       !FormatDataUtils.isEmptyObject(dataResult.data.listImportProduct)
  //     ) {
  //       setImportOrder(dataResult.data.listImportProduct);
  //       console.log(dataResult.data.listImportProduct);
  //     } else {
  //       navigate("/404");
  //     }
  //     console.log("Import Order Detail", dataResult);
  //   } catch (error) {
  //     console.log("Failed to fetch importOrder detail: ", error);
  //   }
  // };
  const fetchProductListByImportOrderId = async () => {
    try {
      const params = {
        // pageIndex: page,
        // pageSize: rowsPerPage,
        orderId: importOrderId,
      };
      const dataResult = await importOrderService.getImportOrderById(params);
      //const dataResult = unwrapResult(actionResult);
      if (dataResult.data) {
        setListConsignments(dataResult.data.listImportProduct);
        // dataResult.data.listImportProduct?.forEach((consignment) => {
        //   arrayHelpersRef.current?.push(consignment);
        // });

        // setTotalRecord(dataResult.data.totalRecord);
        // console.log('totalRecord', dataResult.data.totalRecord);
      }
      console.log("Product List", dataResult);
    } catch (error) {
      console.log("Failed to fetch product list by importOder: ", error);
    }
  };
  // const getAllWarehouse = async () => {
  //   try {
  //     const actionResult = await WarehouseService.getlistWarehouse();
  //     if (actionResult.data) {
  //       setWarehouseList(actionResult.data.warehouses);
  //     }
  //   } catch (error) {
  //     console.log("Failed to fetch category list: ", error);
  //   }
  // };
  useEffect(() => {
    if (isNaN(importOrderId)) {
      navigate("/404");
    } else {
      //getAllWarehouse();
      //fetchImportOrderDetail();
      fetchProductListByImportOrderId();
    }
  }, [page, rowsPerPage]);
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{ consignments: [...listConsignments] }}
        onSubmit={(values) => handleConfirm(values)}
      >
        {({ values, errors, setFieldValue }) => (
          <Form>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Card>
                  <Stack direction="row" justifyContent="space-between" p={2}>
                    <Box>
                      <Typography variant="span">{" "}
                        <strong>Phi???u nh???p h??ng s???:</strong>
                        {"NHAP " + listConsignments[0]?.order_id}
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
                    {/* )} */}
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
                      {!!listConsignments && listConsignments?.length > 0 ? (
                        <Box>
                          <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 200 }} aria-label="customized table">
                              <TableHead>
                                <TableRow>
                                  <StyledTableCell>STT</StyledTableCell>
                                  <StyledTableCell>M?? s???n ph???m</StyledTableCell>
                                  <StyledTableCell>T??n s???n ph???m</StyledTableCell>
                                  <StyledTableCell>H???n l??u kho</StyledTableCell>
                                  <StyledTableCell>????n v???</StyledTableCell>
                                  <StyledTableCell>S??? l?????ng</StyledTableCell>
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
                                                <LocalizationProvider
                                                  className="date-picker"
                                                  locale={vi}
                                                  dateAdapter={AdapterDateFns}
                                                >
                                                  <DatePicker
                                                    onChange={(value) => {
                                                      setFieldValue(
                                                        `consignments[${index}].expiration_date`,
                                                        value,
                                                        false
                                                      );
                                                    }}
                                                    minDate={today}
                                                    value={
                                                      values.consignments[index]
                                                        .expiration_date
                                                    }
                                                    renderInput={(params) => (
                                                      <TextField
                                                        variant="standard"
                                                        {...params}
                                                        helperText={null}
                                                      />
                                                    )}
                                                  />
                                                </LocalizationProvider>
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
                                                    },
                                                  }}
                                                />
                                              </TableCell>
                                              <TableCell>
                                                <TextfieldWrapper
                                                  name={`consignments[${index}].unit_price`}
                                                  variant="standard"
                                                  className="text-field-unit-price"
                                                  type={"number"}
                                                  InputProps={{
                                                    inputProps: {
                                                      min: 0,
                                                    },
                                                  }}
                                                />
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

export default UpdateImportOrder;
