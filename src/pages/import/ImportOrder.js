import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import {
    Box,
    Typography
  } from "@mui/material";
import FormatDataUtils from '../../utils/FormatDataUtils'

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));
const ImportOrderTable = ({importOrders}) => {
    const navigate = useNavigate();
    const handleOnClickTableRow = (id) => {
        navigate(`/import/detail/${id}`);
    };
    return (
        <Box>
        {!!importOrders && (
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 200 }} aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell align="center">Mã nhập kho</StyledTableCell>
                  <StyledTableCell align="center">Ngày tạo</StyledTableCell>
                  <StyledTableCell align="center">Ngày nhập</StyledTableCell>
                  <StyledTableCell align="center">Nhà cung cấp</StyledTableCell>
                  <StyledTableCell align="center">Trạng thái</StyledTableCell>
                  <StyledTableCell align="center">Giá trị đơn hàng</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {importOrders.map((importOrder) => {
                  return (
                    <TableRow
                      hover
                      key={importOrder.orderId}
                      selected={false}
                      onClick={(value) => handleOnClickTableRow(importOrder.orderId)}
                    >
                      <TableCell>
                        <Typography
                          variant="body1"
                          color="text.primary"
                          gutterBottom
                          noWrap
                          align="center"
                        >
                          {'NHAP' + importOrder.orderId}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body1"
                          color="text.primary"
                          gutterBottom
                          noWrap
                          align="center"
                        >
                          {importOrder.billRefernce}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body1"
                          color="text.primary"
                          gutterBottom
                          noWrap
                          align="center"
                        >
                          {FormatDataUtils.formatDateByFormat(
                            importOrder.createDate,
                            'dd/MM/yyyy',
                          )}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {importOrder?.importDate && (
                          <Typography
                            variant="body1"
                            color="text.primary"
                            gutterBottom
                            noWrap
                            align="center"
                          >
                            {FormatDataUtils.formatDateByFormat(
                              importOrder?.importDate,
                              'dd/MM/yyyy',
                            )}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body1"
                          color="text.primary"
                          gutterBottom
                          noWrap
                          align="center"
                        >
                          {importOrder.manufactorName}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body1"
                          color="text.primary"
                          gutterBottom
                          noWrap
                          align="center"
                        >
                          {importOrder.fullName + '(' + importOrder.userName + ')'}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography>{importOrder.statusName}</Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography>
                          {FormatDataUtils.formatCurrency(importOrder.totalPrice)}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    );
}
 
export default ImportOrderTable;