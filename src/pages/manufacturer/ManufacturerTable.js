import * as React from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useNavigate } from "react-router-dom";
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
const ManufacturerTable = ({manufacturerList}) => {
    const navigate=useNavigate();
    const handleOnClickDetailManufacturer = (manufacturerId) => {
        navigate(`/manufacturer/detail/${manufacturerId}`);
    };
    return ( 
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 200 }} aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell>Tên nhà sản xuất</StyledTableCell>
                  <StyledTableCell>Số điện thoại</StyledTableCell>
                  <StyledTableCell>Email</StyledTableCell>
                  <StyledTableCell align="center">Địa chỉ</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {manufacturerList.map((row) => (
                  <TableRow
                    hover
                    key={row.id}
                    onClick={() => handleOnClickDetailManufacturer(row.id)}
                    selected={false}
                  >
                    <TableCell>
                      <Typography
                        variant="body1"
                        color="text.primary"
                        gutterBottom
                        noWrap
                      >
                        {row.name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body1"
                        color="text.primary"
                        gutterBottom
                        noWrap
                      >
                        {row.phone}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body1"
                        color="text.primary"
                        gutterBottom
                        noWrap
                      >
                        {row.email}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">{row.address}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
     );
}
 
export default ManufacturerTable;