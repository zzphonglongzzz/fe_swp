import * as React from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import { useState, useEffect } from "react";
import CategoryService from "../../service/CategoryService";
import { Container } from "@mui/system";
import { useNavigate } from "react-router-dom";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

export default function CategoryList() {
  const [categoryList, setCategoryList] = useState([]);
  const navigate = useNavigate();

  const handleOnClickDetailCategory = (categoryId) => {
    navigate(`/category/detail/${categoryId}`);
  };
  const fetchCategoryList = async () => {
    try {
      const actionResult = await CategoryService.getAll();
      if (actionResult.data) {
        setCategoryList(actionResult.data.category);
      }
    } catch (error) {
      console.log("Failed to fetch category list: ", error);
    }
  };
  useEffect(() => {
    fetchCategoryList();
  }, []);
  return (
    <Container maxWidth="xl">
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 200 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Tên danh mục</StyledTableCell>
              <StyledTableCell align="right">Mô tả</StyledTableCell>
              <StyledTableCell align="right">Hành động</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categoryList?.map((row) => (
              <StyledTableRow key={row.id}>
                <StyledTableCell component="th" scope="row">
                  {row.name}
                </StyledTableCell>
                <StyledTableCell align="right">
                  {row.description}
                </StyledTableCell>
                <StyledTableCell align="right">
                  <Button
                    variant="contained"
                    onClick={() => handleOnClickDetailCategory(row.id)}
                  >
                    Xem chi tiết
                  </Button>
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}
