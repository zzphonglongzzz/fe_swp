import { useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import FormatDataUtils from "../../utils/FormatDataUtils";
import { Typography } from "@mui/material";
import Label from "../../component/common/Label";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));
const getStatusLabel = (exportOrderStatus) => {
  const map = {
    canceled: {
      text: "Đã huỷ",
      color: "error",
    },
    completed: {
      text: "Đã xuất kho",
      color: "success",
    },
    pending: {
      text: "Đang chờ xử lý",
      color: "warning",
    },
    returned: {
      text: "Đã xuất kho",
      color: "primary",
    },
  };

  const { text, color } = map[exportOrderStatus];

  return <Label color={color}>{text}</Label>;
};
const ReturnProductTable = ({ listConsignments }) => {
  const formatCurrency = (value) =>
    value.toLocaleString("it-IT", { style: "currency", currency: "VND" });
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 200 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>STT</StyledTableCell>
            <StyledTableCell>Mã sản phẩm</StyledTableCell>
            <StyledTableCell>Tên sản phẩm</StyledTableCell>
            <StyledTableCell>Vị trí</StyledTableCell>
            <StyledTableCell>Đơn vị</StyledTableCell>
            <StyledTableCell>Số lượng Trả về</StyledTableCell>
            <StyledTableCell>Đơn giá</StyledTableCell>
            <StyledTableCell>Thành tiền</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {listConsignments.map((exportOrder, index) => {
            return (
              <TableRow hover key={exportOrder.orderId} selected={false}>
                <TableCell>
                  <Typography>{index + 1}</Typography>
                </TableCell>
                <TableCell>
                  <Typography>{exportOrder.product_code}</Typography>
                </TableCell>
                <TableCell>
                  <Typography>{exportOrder.product_name}</Typography>
                </TableCell>
                <TableCell>
                  <Typography>{exportOrder.warehouse_name}</Typography>
                </TableCell>
                <TableCell>
                  <Typography>{exportOrder.unit_measure}</Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography>{exportOrder.quantity}</Typography>
                </TableCell>
                <TableCell>
                  <Typography>{formatCurrency(exportOrder?.unit_price)}</Typography>
                </TableCell>
                <TableCell>
                  <Typography>{formatCurrency(exportOrder?.quantity * exportOrder?.unit_price)}</Typography>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ReturnProductTable;
