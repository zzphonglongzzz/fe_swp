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
import { useNavigate, useParams } from "react-router-dom";
import { Card, Grid, Stack, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import './CategoryDetail.scss'

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
const CategoryDetail = () => {
  const { categoryId } = useParams();
  const [categoryName, setCategoryName] = useState();
  const [subCategoryList, setSubCategoryList] = useState([]);
  const navigate = useNavigate();

  const handleOnClickAdd = () => {
    console.log("Add new sub category");
  };
  useEffect(() => {
    CategoryService.getAllCategoryDetail(categoryId)
      .then((response) => {
        setCategoryName(response.data.name);
        setSubCategoryList(response.data.subCategory);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [categoryId]);
  return (
    <Grid>
      <Card className="cardHeader">
        <Stack>
          <Typography variant="h5" style={{ fontWeight: "bold" }}>
            {categoryName}
          </Typography>
        </Stack>
        <Button
          onClick={() => handleOnClickAdd()}
          color="warning"
          variant="contained"
          startIcon={<AddIcon />}
        >
          Thêm mới danh mục phụ
        </Button>
      </Card>
      <Card>
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
            {subCategoryList.map((row) => (
              <StyledTableRow key={row.id}>
                <StyledTableCell component="th" scope="row">
                  {row.name}
                </StyledTableCell>
                <StyledTableCell align="right">
                  {row.description}
                </StyledTableCell>
                <StyledTableCell align="right"></StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      </Card>
    </Grid>
  );
};

export default CategoryDetail;
