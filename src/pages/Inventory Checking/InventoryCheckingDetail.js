import React, { Fragment, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Divider,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import FormatDataUtils from "../../utils/FormatDataUtils";
import InventoryCheckingService from "../../service/InventoryCheckingService";
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

const InventoryCheckingDetail = () => {
  const { inventoryCheckingId } = useParams();
  const [inventoryChecking, setInventoryChecking] = useState();
  const navigate = useNavigate();

  const fetchInventoryCheckingDetail = async () => {
    try {
      const dataResult =
        await InventoryCheckingService.getInventoryCheckingHistoryDetail(
          inventoryCheckingId
        );
      console.log("dataResult", dataResult);
      if (dataResult.data) {
        setInventoryChecking(dataResult.data.stockTakingHistoryDetail);
      } else {
        navigate("/404");
      }
    } catch (error) {
      console.log("Failed to fetch inventoryChecking detail: ", error);
    }
  };
  useEffect(() => {
    if (isNaN(inventoryCheckingId)) {
      navigate("/404");
    } else {
      fetchInventoryCheckingDetail();
    }
  }, []);
  return (
    <Box>
      {inventoryChecking && (
        <Grid container spacing={2}>
          <Grid xs={12} item>
            <Card>
              <CardContent>
                <Typography variant="h6">Thông tin kiểm kho</Typography>
                <Stack spacing={2} p={2}>
                  <Grid container>
                    <Grid xs={2} item>
                      <Typography className="labelInfo">Người tạo</Typography>
                    </Grid>
                    <Grid xs={5} item>
                      <Typography className="contentInfo">
                        {inventoryChecking.userName}
                      </Typography>
                    </Grid>
                    <Grid xs={2} item>
                      <Typography className="labelInfo">
                        Ngày kiểm kho
                      </Typography>
                    </Grid>
                    <Grid xs={3} item>
                      <Typography className="contentInfo">
                        {FormatDataUtils.formatDate(
                          inventoryChecking.createDate
                        )}
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid container>
                    <Grid xs={2} item>
                      <Typography className="labelInfo">Kho</Typography>
                    </Grid>
                    <Grid xs={4} item>
                      <Typography className="contentInfo">
                        {inventoryChecking.wareHouseName}
                      </Typography>
                    </Grid>
                    <Grid xs={6} item></Grid>
                  </Grid>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid xs={12} item>
            <Card>
              <CardContent className="cardTable">
                <Typography variant="h6">Các sản phẩm kiểm kho</Typography>
                <TableContainer component={Paper}>
                  {inventoryChecking?.listProduct && (
                    <Table sx={{ minWidth: 200 }} aria-label="customized table">
                      <TableHead>
                        <TableRow>
                          <StyledTableCell>STT</StyledTableCell>
                          <StyledTableCell>Mã sản phẩm</StyledTableCell>
                          <StyledTableCell>Tên sản phẩm</StyledTableCell>
                          <StyledTableCell>Đơn vị</StyledTableCell>
                          <StyledTableCell align="center">
                            Đơn giá
                          </StyledTableCell>
                          <StyledTableCell></StyledTableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {inventoryChecking?.listProduct.map(
                          (product, index) => {
                            return (
                              <Fragment key={index}>
                                <TableRow
                                  hover
                                  //   selected={islistProductselected}
                                  selected={false}
                                >
                                  {/* TODO: Sửa phần index khi phân trang */}
                                  <TableCell>{index + 1}</TableCell>
                                  <TableCell>{product?.productCode}</TableCell>
                                  <TableCell>{product?.name}</TableCell>
                                  <TableCell>{product.unitMeasure}</TableCell>
                                  <TableCell align="center">
                                    {product?.unitPrice}
                                  </TableCell>
                                  <TableCell></TableCell>
                                </TableRow>
                                <TableRow className="rowConsignment">
                                  <TableCell className="tableCellConsignment"></TableCell>
                                  <TableCell
                                    colSpan={4}
                                    className="tableCellConsignment"
                                  >
                                    <Table className="tableCosignment">
                                      <TableBody>
                                        <TableRow>
                                          <TableCell>Ngày nhập</TableCell>
                                          <TableCell>Hạn lưu kho</TableCell>
                                          <TableCell align="center">
                                            Số lượng đầu
                                          </TableCell>
                                          <TableCell align="center">
                                            Số lượng thực tế
                                          </TableCell>
                                          <TableCell align="center">
                                            Giá trị chênh lệch
                                          </TableCell>
                                          <TableCell align="center">
                                            Ghi Chú
                                          </TableCell>
                                          <TableCell align="center">
                                            Số lượng chênh lệch
                                          </TableCell>
                                        </TableRow>
                                        {product?.listConsignment.map(
                                          (consignment, indexConsignment) => (
                                            <TableRow key={indexConsignment}>
                                              <TableCell>
                                                {FormatDataUtils.formatDate(
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
                                                {consignment?.instockQuantity}
                                              </TableCell>
                                              <TableCell align="center">
                                                {consignment?.realityQuantity}
                                              </TableCell>
                                              <TableCell align="center">
                                                {consignment?.deviantAmount &&
                                                  FormatDataUtils.formatCurrency(
                                                    consignment?.deviantAmount
                                                  )}
                                              </TableCell>
                                              <TableCell align="center">
                                                {consignment?.descriptions &&
                                                  FormatDataUtils.formatCurrency(
                                                    consignment?.descriptions
                                                  )}
                                              </TableCell>
                                              <TableCell align="center">
                                                {
                                                  consignment?.different_quantity
                                                }
                                              </TableCell>
                                            </TableRow>
                                          )
                                        )}
                                      </TableBody>
                                    </Table>
                                  </TableCell>
                                  <TableCell></TableCell>
                                </TableRow>
                              </Fragment>
                            );
                          }
                        )}
                      </TableBody>
                    </Table>
                  )}
                </TableContainer>
              </CardContent>
              <Box className="totalDifferentContainer">
                <Divider />
                <Stack direction="row" p={2} justifyContent="space-between">
                  <Typography className="labelTotalDifferent">
                    Tổng chênh lệch:
                  </Typography>
                  <Typography className="totalDifferent">
                    <b>
                      {FormatDataUtils.formatCurrency(
                        inventoryChecking.totalDifferentAmount
                      )}
                    </b>
                  </Typography>
                </Stack>
              </Box>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default InventoryCheckingDetail;
