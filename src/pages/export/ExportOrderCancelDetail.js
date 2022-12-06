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
import { Close, Edit } from "@mui/icons-material";
import { Form, Formik, useField, FieldArray } from "formik";
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
const ExportOrderCancelDetail = () => {
  const { exportOrderId } = useParams();
  const navigate = useNavigate();
  const [productList, setProductList] = useState([]);
  const arrayHelpersRef = useRef(null);
  const valueFormik = useRef();
  const errorFormik = useRef();

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
  const fetchConsignmentsByExportOrderId = async () => {
    try {
      const dataResult =
        await ExportOrderService.getDetailCancelDeliveredOrder(
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
                    </Box>
                  </Stack>
                </Card>
              </Grid>
              <Grid xs={12} item>
                <Grid xs={20} item>
                  <Card>
                    {!!productList && productList?.length > 0 ? (
                      <Box>
                        <TableContainer>
                          <Table>
                            <TableHead>
                              <TableRow>
                                <TableCell>STT</TableCell>
                                <TableCell>Mã sản phẩm</TableCell>
                                <TableCell>Tên sản phẩm</TableCell>
                                <TableCell>Số lượng</TableCell>
                                <TableCell>Số lượng bị lỗi</TableCell>
                                <TableCell align="center">
                                  Mô tả chi tiết
                                </TableCell>
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
                                              {consignment?.name}
                                            </TableCell>
                                            <TableCell>
                                              {consignment?.quantity}
                                            </TableCell>
                                            <TableCell>
                                              {consignment?.damaged_quantity}
                                            </TableCell>
                                            <TableCell align="center">
                                              {consignment?.description}
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
                {/* <Grid xs={12} item>
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
                </Grid> */}
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default ExportOrderCancelDetail;
