import { useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Typography } from "@mui/material";
import FormatDataUtils from "../../utils/FormatDataUtils";
import Label from "../../component/common/Label";

const getStatusLabel = (importOrderStatus) => {
  const map = {
    canceled: {
      text: "Đã huỷ",
      color: "error",
    },
    completed: {
      text: "Đã nhập kho",
      color: "success",
    },
    pending: {
      text: "Đang chờ xử lý",
      color: "warning",
    },
  };

  const { text, color } = map[importOrderStatus];

  return <Label color={color}>{text}</Label>;
};
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));
const ImportOrdersTable = ({ importOrderList }) => {
  const navigate = useNavigate();
  
  const handleOnClickTableRow = (id) => {
    navigate(`/import/detail/${id}`);
  };
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 200 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Mã nhập kho</StyledTableCell>
            <StyledTableCell>Ngày tạo</StyledTableCell>
            <StyledTableCell>Ngày nhập</StyledTableCell>
            <StyledTableCell>Nhà cung cấp</StyledTableCell>
            <StyledTableCell>Người tạo đơn</StyledTableCell>
            <StyledTableCell>Trạng thái</StyledTableCell>
            <StyledTableCell>Giá trị đơn hàng</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {importOrderList.map((row) => (
            <TableRow
              hover
              key={row.id}
              onClick={() => handleOnClickTableRow(row.id)}
              selected={false}
            >
              <TableCell>
                <Typography
                  variant="body1"
                  color="text.primary"
                  gutterBottom
                  noWrap
                >
                  {"NHAP" + row.id}
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
                    row?.created_date,
                    "dd/MM/yyyy"
                  )}
                </Typography>
              </TableCell>
              <TableCell>
                {importOrderList?.confirm_date && (
                  <Typography
                    variant="body1"
                    color="text.primary"
                    gutterBottom
                    noWrap
                    align="center"
                  >
                    {FormatDataUtils.formatDateByFormat(
                      importOrderList?.confirm_date,
                      "dd/MM/yyyy"
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
                >
                  {FormatDataUtils.truncate(row.manufacturer_name, 20)}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography
                  variant="body1"
                  color="text.primary"
                  gutterBottom
                  noWrap
                >
                  {row.user_name}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography
                  variant="body1"
                  color="text.primary"
                  gutterBottom
                  noWrap
                >
                  {getStatusLabel(row.status)}
                </Typography>
              </TableCell>
              {/* <TableCell align="center">
                <Typography>
                  {FormatDataUtils.formatCurrency(row.totalPrice)}
                </Typography>
              </TableCell> */}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ImportOrdersTable;
