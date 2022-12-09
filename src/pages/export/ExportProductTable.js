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

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));
const ExportProductTable = ({ listConsignment }) => {
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
            <StyledTableCell>Vị Trí</StyledTableCell>
            <StyledTableCell>Hạn Lưu kho</StyledTableCell>
            <StyledTableCell>Đơn vị</StyledTableCell>
            <StyledTableCell align="center">Số lượng</StyledTableCell>
            <StyledTableCell align="center">Đơn giá</StyledTableCell>
            <StyledTableCell align="center">Thành tiền</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
        {listConsignment.map((consignment, index) => (
            <TableRow
              hover
              key={index}
              selected={false}
            >
              <TableCell>
                <Typography
                  variant="body1"
                  color="text.primary"
                  gutterBottom
                  noWrap
                >
                  {index + 1}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography
                  variant="body1"
                  color="text.primary"
                  gutterBottom
                  noWrap
                >
                 {consignment?.product_code}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography
                  variant="body1"
                  color="text.primary"
                  gutterBottom
                  noWrap
                >
                  {consignment?.product_name}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography
                  variant="body1"
                  color="text.primary"
                  gutterBottom
                  noWrap
                >
                  {consignment?.warehouse_name}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography
                  variant="body1"
                  color="text.primary"
                  gutterBottom
                  noWrap
                >
                  {consignment?.expiration_date
                    ? FormatDataUtils.formatDate(consignment?.expiration_date)
                    : 'Không có'}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography
                  variant="body1"
                  color="text.primary"
                  gutterBottom
                  noWrap
                >
                  {consignment?.unit_measure}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography
                  variant="body1"
                  color="text.primary"
                  gutterBottom
                  noWrap
                >
                  {consignment?.quantity}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography
                  variant="body1"
                  color="text.primary"
                  gutterBottom
                  noWrap
                >
                  {formatCurrency(consignment?.unit_price)}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography
                  variant="body1"
                  color="text.primary"
                  gutterBottom
                  noWrap
                >
                  {formatCurrency(consignment?.quantity * consignment?.unit_price)}
                </Typography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ExportProductTable;
