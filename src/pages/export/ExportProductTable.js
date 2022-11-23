import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import FormatDataUtils from "../../utils/FormatDataUtils";
import Fragment from 'react'

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));
const ExportProductTable = ({ productList }) => {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 200 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>STT</StyledTableCell>
            <StyledTableCell>Mã sản phẩm</StyledTableCell>
            <StyledTableCell>Tên sản phẩm</StyledTableCell>
            <StyledTableCell>Đơn vị</StyledTableCell>
            <StyledTableCell align="center">Số lượng</StyledTableCell>
            <StyledTableCell align="center">Đơn giá</StyledTableCell>
            <StyledTableCell align="center">Thành tiền</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {productList.map((product, index) => {
            return (
              <Fragment key={index}>
                <TableRow
                  hover
                  //   selected={islistProductselected}
                  selected={false}
                >
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{product?.productCode}</TableCell>
                  <TableCell>{product?.productName}</TableCell>
                  <TableCell>
                    {product?.unitMeasure}
                  </TableCell>
                  <TableCell align="center">{product?.quantity}</TableCell>
                  <TableCell align="center">
                    {FormatDataUtils.formatCurrency(product?.unitPrice)}
                  </TableCell>
                  <TableCell align="center">
                    {FormatDataUtils.formatCurrency(
                      product?.quantity * product?.unitPrice
                    )}
                  </TableCell>
                </TableRow>
                <TableRow>
                  
                  <TableCell
                    colSpan={5}
                  >
                    <Table>
                      <TableBody>
                        <TableRow>
                          <TableCell>Vị trí</TableCell>
                          <TableCell>Ngày nhập</TableCell>
                          <TableCell>Hạn lưu kho</TableCell>
                          <TableCell align="center">Số lượng</TableCell>
                        </TableRow>
                        {product?.consignmentList.map(
                          (consignment, indexConsignment) => (
                            <TableRow
                              key={indexConsignment}
                              // hover
                            >
                              <TableCell>
                                {consignment?.warehouseName}
                              </TableCell>
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
                                {consignment?.quantity}
                              </TableCell>
                            </TableRow>
                          )
                        )}
                      </TableBody>
                    </Table>
                  </TableCell>
                </TableRow>
              </Fragment>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ExportProductTable;
