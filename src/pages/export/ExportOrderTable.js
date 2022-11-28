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
const ExportOrderTable = ({ exportOrders }) => {
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
                onClick={(value) => handleOnClickTableRow(exportOrder.id)}
              >
                <TableCell>
                  <Typography
                    variant="body1"
                    color="text.primary"
                    gutterBottom
                    noWrap
                  >
                    {"XUAT" + exportOrder.id}
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
                      exportOrder.created_date,
                      "dd/MM/yyyy"
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
                    {exportOrder.confirm_date &&
                      FormatDataUtils.formatDateByFormat(
                        exportOrder.confirm_date,
                        "dd/MM/yyyy"
                      )}
                    {/* {exportOrder.createDate} */}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography>{exportOrder?.user_name}</Typography>
                </TableCell>
                <TableCell>
                  <Typography>{getStatusLabel(exportOrder.status)}</Typography>
                </TableCell>
                <TableCell>
                  <Typography
                    variant="body1"
                    color="text.primary"
                    gutterBottom
                    noWrap
                  >
                    {FormatDataUtils.formatCurrency(
                      exportOrder.totalPrice || 0
                    )}
                  </Typography>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ExportOrderTable;
