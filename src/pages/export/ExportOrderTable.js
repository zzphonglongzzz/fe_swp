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
const ExportOrderTable = ({exportOrders}) => {
    const navigate = useNavigate();
    const handleOnClickTableRow = (id) => {
        navigate(`/export/detail/${id}`);
    };
    return ( 
        
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 200 }} aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell>Mã xuất kho</StyledTableCell>
                  <StyledTableCell>Ngày tạo</StyledTableCell>
                  <StyledTableCell>Ngày xuất</StyledTableCell>
                  <StyledTableCell>Người tạo đơn</StyledTableCell>
                  <StyledTableCell>Trạng thái</StyledTableCell>
                  <StyledTableCell>Giá trị đơn hàng</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {exportOrders.map((exportOrder) => {
                  return (
                    <TableRow
                      hover
                      key={exportOrder.orderId}
                      selected={false}
                      onClick={(value) => handleOnClickTableRow(exportOrder.orderId)}
                    >
                      <TableCell>
                        <Typography
                          variant="body1"
                          color="text.primary"
                          gutterBottom
                          noWrap
                        >
                          {'XUAT' + exportOrder.orderId}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body1"
                          color="text.primary"
                          gutterBottom
                          noWrap
                        >
                          {FormatDataUtils.formatDateByFormat(
                            exportOrder.createDate,
                            'dd/MM/yyyy',
                          )}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body1"
                          color="text.primary"
                          gutterBottom
                          noWrap
                        >
                          {exportOrder.confirmDate &&
                            FormatDataUtils.formatDateByFormat(
                              exportOrder.confirmDate,
                              'dd/MM/yyyy',
                            )}
                          {/* {exportOrder.createDate} */}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography >
                          {exportOrder.fullName + '(' + exportOrder?.userName + ')'}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography >
                          {exportOrder.statusName}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography
                          variant="body1"
                          color="text.primary"
                          gutterBottom
                          noWrap
                        >
                          {FormatDataUtils.formatCurrency(exportOrder.totalPrice || 0)}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
    );
}
 
export default ExportOrderTable;