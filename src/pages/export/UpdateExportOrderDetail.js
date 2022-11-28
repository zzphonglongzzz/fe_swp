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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  TextField,
} from "@mui/material";
import FormatDataUtils from "../../utils/FormatDataUtils";
import { Close, Done } from "@mui/icons-material";
import { Form, Formik, useField } from "formik";
import * as Yup from "yup";
import ExportOrderService from "../../service/ExportOrderService";
import "./UpdateExportTable.scss";
import AlertPopup from "../../component/common/AlertPopup/index";

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
    setTitle("Bạn có chắc chắn muốn lưu lại chỉnh sửa không?");
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
    const productList = valueFormik.current.productList;
    if (productList) {
      for (let index = 0; index < productList.length; index++) {
        const product = productList[index];
        const quantity = calculateTotalQuantityOfProduct(product);
        totalAmount = totalAmount + quantity * +product?.unitPrice;
      }
    }
    return totalAmount;
  };
  const handleConfirm = async () => {
    if (isConfirm) {
      const values = valueFormik.current;
      let productList = values.productList;
      let consignmentExports = [];
      console.log("xác nhận", values);

      for (let index = 0; index < productList.length; index++) {
        if (calculateTotalQuantityOfProduct(productList[index]) === 0) {
          setErrorMessage("Bạn có sản phẩm chưa nhập số lượng");
          setOpenPopup(true);
          return;
        }
        const consignments = productList[index]?.consignmentList;
        for (
          let indexConsignment = 0;
          indexConsignment < consignments.length;
          indexConsignment++
        ) {
          let consignment = consignments[indexConsignment];
          const quantity = consignment.quantity;
          if (quantity > consignment.quantityInstock) {
            setErrorMessage(
              "Bạn không thể nhập số lượng lớn hơn số lượng tồn kho của lô hàng"
            );
            setOpenPopup(true);
            return;
          }

          if (!Number.isInteger(quantity)) {
            setErrorMessage(
              "Vui lòng nhập số lượng sản phẩm với đơn vị nhỏ nhất là số nguyên"
            );
            setOpenPopup(true);
            return;
          }

          if (quantity < 0) {
            setErrorMessage("Bạn không thể nhập số lượng nhỏ hơn 0");
            setOpenPopup(true);
            return;
          }
          if (quantity >= 0) {
            consignmentExports.push({
              id: consignment.id,
              quantity: quantity,
              unitPrice: productList[index].unitPrice,
            });
          }
        }
      }
      const editedExportOrder = {
        orderId: exportOrderId,
        //billReferenceNumber: values.billRefernce,
        // createdDate: values.createDate,
        //description: values.description,
        userId: values.userId,
        manufactorId: values.manufactorId,
        wareHouseId: values.wareHouseId,
        consignmentExports: consignmentExports,
      };
      if (consignmentExports.length > 0) {
        console.log(editedExportOrder);
        try {
          const resultResponse = await ExportOrderService.updateExportOrder(
            editedExportOrder
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
        // pageIndex: page,
        // pageSize: rowsPerPage,
        orderId: exportOrderId,
      };
      const dataResult = await ExportOrderService.getExportOrderById(
        exportOrderId
      );
      if (dataResult.data) {
        setProductList(dataResult.data.productList);
        //setAddressWarehouse(dataResult.data.addressWarehouse);
        // setTotalRecord(dataResult.data.totalRecord);
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
    <Box>
      {productList.length > 0 && (
        <Formik
          initialValues={{ productList: [...productList] }}
          onSubmit={(values) => handleConfirm(values)}
        >
          {({ values, errors, setFieldValue }) => {
            valueFormik.current = values;
            errorFormik.current = errors;
            return (
              <Form>
                <Grid container spacing={2}>
                  <Grid xs={12} item>
                    <Card>
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        p={2}
                      >
                        <Box>
                          <Typography variant="span">
                            <strong>Phiếu xuất kho số:</strong>{" "}
                            {"XUAT" + exportOrderId}
                          </Typography>
                        </Box>
                        {productList.confirm_by == null && (
                          <Stack
                            direction="row"
                            justifyContent="flex-end"
                            spacing={2}
                          >
                            <Button
                              variant="contained"
                              startIcon={<Done />}
                              color="warning"
                              onClick={() => handleOnClickConfirm()}
                            >
                              Lưu chỉnh sửa
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
                        )}
                      </Stack>
                    </Card>
                  </Grid>
                  <Grid xs={9} item>
                    <Grid container spacing={2}>
                      <Grid xs={12} item>
                        <Card>
                          <TableContainer>
                            <Table>
                              <TableHead>
                                <TableRow>
                                  <TableCell>STT</TableCell>
                                  <TableCell>Mã sản phẩm</TableCell>
                                  <TableCell>Tên sản phẩm</TableCell>
                                  <TableCell>Đơn vị</TableCell>
                                  <TableCell align="center">Số lượng</TableCell>
                                  <TableCell align="center">Đơn giá</TableCell>
                                  <TableCell align="center">
                                    Thành tiền
                                  </TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {!!productList &&
                                  productList.length > 0 &&
                                  productList.map((product, index) => (
                                    <Fragment key={index}>
                                      <TableRow
                                        hover
                                        //   selected={islistProductselected}
                                        selected={false}
                                      >
                                        {/* TODO: Sửa phần index khi phân trang */}
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>
                                          {product?.productCode}
                                        </TableCell>
                                        <TableCell>
                                          {product?.productName}
                                        </TableCell>
                                        <TableCell>
                                          {product?.unitMeasure}
                                        </TableCell>
                                        <TableCell align="center">
                                          {calculateTotalAmount(
                                            values.productList[index]
                                          )}
                                        </TableCell>
                                        <TableCell align="center">
                                          {FormatDataUtils.formatCurrency(
                                            product?.unitPrice
                                          )}
                                        </TableCell>
                                        <TableCell align="center">
                                          {FormatDataUtils.formatCurrency(
                                            calculateTotalQuantityOfProduct(
                                              values.productList[index]
                                            ) * product.unitPrice
                                          )}
                                        </TableCell>
                                      </TableRow>
                                      <TableRow>
                                        <TableCell colSpan={5}>
                                          <Table>
                                            <TableBody>
                                              <TableRow>
                                                <TableCell>Vị trí</TableCell>
                                                <TableCell>Ngày nhập</TableCell>
                                                <TableCell>
                                                  Hạn lưu kho
                                                </TableCell>
                                                <TableCell align="center">
                                                  Số lượng
                                                </TableCell>
                                                <TableCell align="center">
                                                  Tồn kho
                                                </TableCell>
                                              </TableRow>
                                              {/* {product?.consignmentList.map(
                                                (
                                                  consignment,
                                                  indexConsignment
                                                ) => (
                                                  <TableRow
                                                    key={indexConsignment}
                                                    // hover
                                                  >
                                                    <TableCell>
                                                      {
                                                        consignment?.warehouseName
                                                      }
                                                    </TableCell>
                                                    <TableCell>
                                                      {consignment?.importDate &&
                                                        FormatDataUtils.formatDateTime(
                                                          consignment?.importDate
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                      {consignment?.expirationDate
                                                        ? FormatDataUtils.formatDate(
                                                            consignment?.expirationDate
                                                          )
                                                        : "Không có"}
                                                    </TableCell>
                                                    <TableCell align="center">
                                                      <Stack
                                                        direction="row"
                                                        justifyContent="center"
                                                      >
                                                        <TextfieldWrapper
                                                          name={`productList[${index}].consignmentList[${indexConsignment}].quantity`}
                                                          variant="standard"
                                                          className="text-field-quantity"
                                                          type={"number"}
                                                          InputProps={{
                                                            inputProps: {
                                                              min: 0,
                                                              max: consignment?.quantityInstock,
                                                              step: 1,
                                                            },
                                                          }}
                                                        />
                                                      </Stack>
                                                    </TableCell>
                                                    <TableCell align="center">
                                                      {
                                                        consignment?.quantityInstock
                                                      }
                                                    </TableCell>
                                                  </TableRow>
                                                )
                                              )} */}
                                            </TableBody>
                                          </Table>
                                        </TableCell>
                                      </TableRow>
                                    </Fragment>
                                  ))}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        </Card>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid xs={3} item>
                    <Grid container spacing={2}>
                      <Grid xs={12} item>
                        <Card>
                          <CardContent>
                            <Typography variant="h6">
                              Thông tin xác nhận
                            </Typography>
                            <Stack spacing={2}>
                              <Box>
                                <Typography>
                                  Người tạo đơn: <i>{productList.creator}</i>
                                </Typography>
                                {/* <Typography>Ngày tạo đơn:</Typography>
                                <Typography>
                                  {FormatDataUtils.formatDateTime(
                                    exportOrder.createDate
                                  )}
                                </Typography> */}
                              </Box>
                            </Stack>
                          </CardContent>
                        </Card>
                      </Grid>
                      <Grid xs={12} item>
                        <Card>
                          <CardContent className="warehourseInfo">
                            <Typography variant="h6">Kho lấy hàng</Typography>
                            <Stack spacing={2}>
                              {productList.length > 0 &&
                                productList.map((address, index) => (
                                  <Box
                                    key={index}
                                    className="warehouseContainer"
                                  >
                                    <Typography>
                                      {address.warehouse_name}
                                    </Typography>
                                  </Box>
                                ))}
                            </Stack>
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
            );
          }}
        </Formik>
      )}
    </Box>
  );
};

export default UpdateExportOrderDetail;
