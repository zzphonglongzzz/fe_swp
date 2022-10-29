import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import * as React from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Container } from "@mui/system";
import { Typography } from "@mui/material";
import ProductService from "../../service/ProductService";
import {
  Grid,
  Stack,
  Button,
  Card,
  CardHeader,
  TextField,
  InputAdornment,
  Box,
} from "@mui/material";
import { Add, Search } from "@mui/icons-material";
import SearchIcon from "@mui/icons-material/Search";
import usePagination from "../../utils/Pagination";
import { Pagination } from "@mui/material";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const ProductList = () => {
  const navigate = useNavigate();
  const [productList, setProductList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [manufacturerList, setManufactureList] = useState([]);
  const [page, setPage] = useState(1);
  const [keyword, setKeyword] = useState();
  const PER_PAGE = 2;

  const count = Math.ceil(productList.length / PER_PAGE);
  const _DATA = usePagination(productList, PER_PAGE);

  const handleChange = (e, p) => {
    setPage(p);
    _DATA.jump(p);
  };
  const handleOnClickDetailProduct = (productId) => {
    navigate(`/product/detail/${productId}`);
  };
  const handleOnclickAddNewProduct = () => {
    navigate("/product/add");
  };
  const handleSearch = (e) => {
    setKeyword(e.target.value);
  };
  const handleSearchChange = (e) => {
    console.log(e.target.value);
  };
  useEffect(() => {
    ProductService.getAllProductList()
      .then((response) => {
        setProductList(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return ( 
    <Container maxWidth="xl">
      <Grid container spacing={2} justifyContent="flex-end">
        <Stack direction="row" spacing={1} paddingY={1}>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOnclickAddNewProduct()}
          >
            Thêm sản phẩm mới
          </Button>
        </Stack>
        <Grid xs={13} item>
          <Card>
            <CardHeader title="Tìm kiếm thông tin sản phẩm" />
            <Stack direction="row" spacing={2} padding={2}>
              <TextField
                id="outlined-basic"
                name="keyword"
                placeholder="Tìm kiếm theo tên sản phẩm..."
                sx={{ width: '30%' }}
                label={null}
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  )
                }}
                onChange={handleSearchChange}
              />
              <Button
                sx={{ width: '10%' }}
                variant="contained"
                startIcon={<SearchIcon />}
                className="btnSearch"
                onClick={handleSearch}
              >
                Tìm kiếm
              </Button>
            </Stack>
          </Card>
        </Grid>
        <Grid xs={12} item>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 200 }} aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell>Mã sản phẩm</StyledTableCell>
                  <StyledTableCell>Tên sản phẩm</StyledTableCell>
                  <StyledTableCell>Danh mục</StyledTableCell>
                  <StyledTableCell>Nhà cung cấp</StyledTableCell>
                  <StyledTableCell>Đơn vị tính</StyledTableCell>
                  <StyledTableCell>Tồn kho</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {_DATA.currentData().map((row) => (
                  <TableRow
                    hover
                    key={row.id}
                    onClick={() => handleOnClickDetailProduct(row.id)}
                  >
                    <TableCell>
                      <Typography
                        variant="body1"
                        color="text.primary"
                        gutterBottom
                        noWrap
                      >
                        {row.productCode}
                      </Typography>
                    </TableCell>
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
                        {row.categoryName}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body1"
                        color="text.primary"
                        gutterBottom
                        noWrap
                      >
                        {row.manufacturerName}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body1"
                        color="text.primary"
                        gutterBottom
                        noWrap
                      >
                        {row.unitMeasure}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body1"
                        color="text.primary"
                        gutterBottom
                        noWrap
                      >
                        {row.quantity}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
        <Grid
          xs={12}
          item
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Pagination
            count={count}
            size="large"
            page={page}
            variant="outlined"
            shape="rounded"
            onChange={handleChange}
          />
        </Grid>
      </Grid>
    </Container>
  );
}
 
export default ProductList;