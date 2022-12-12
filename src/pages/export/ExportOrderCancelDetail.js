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
  Stack,
  Typography,
} from "@mui/material";
import FormatDataUtils from "../../utils/FormatDataUtils";
import { Close, Edit } from "@mui/icons-material";
import { Form, Formik, FieldArray } from "formik";
import * as Yup from "yup";
import ExportOrderService from "../../service/ExportOrderService";
import "./UpdateExportTable.scss";

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
                        <TableContainer component={Paper}>
                          <Table sx={{ minWidth: 200 }} aria-label="customized table">
                            <TableHead>
                              <TableRow>
                                <StyledTableCell>STT</StyledTableCell>
                                <StyledTableCell>Mã sản phẩm</StyledTableCell>
                                <StyledTableCell>Tên sản phẩm</StyledTableCell>
                                <StyledTableCell>Số lượng</StyledTableCell>
                                <StyledTableCell>Số lượng bị lỗi</StyledTableCell>
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
