import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
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
  Toolbar,
} from "@mui/material";
import { Add, Search } from "@mui/icons-material";
import SearchIcon from "@mui/icons-material/Search";
import CustomTablePagination from "../../component/common/Pagination";
import CategoryService from "../../service/CategoryService";
import ManfacuturerService from "../../service/ManufacturerService";
import FormatDataUtils from "../../utils/FormatDataUtils";
import Select from "react-select";
import { Form, Formik, useField } from "formik";
import "./product.scss";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));
const TextfieldWrapper = ({ name, ...otherProps }) => {
  const [field, meta] = useField(name);

  const configTextfield = {
    ...field,
    ...otherProps,
  };

  if (meta && meta.touched && meta.error) {
    configTextfield.error = true;
    configTextfield.helperText = meta.error;
  }
  return <TextField {...configTextfield} />;
};
const ProductList = () => {
  const navigate = useNavigate();
  const [productList, setProductList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [manufacturerList, setManufactureList] = useState([]);
  const pages = [5, 10];
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(pages[page]);
  const [totalRecord, setTotalRecord] = useState(0);
  const [searchParams, setSearchParams] = useState({});
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedManufactor, setSelectedManufactor] = useState(null);

  const handleOnClickDetailProduct = (productId) => {
    navigate(`/product/detail/${productId}`);
  };
  const handleOnclickAddNewProduct = () => {
    navigate("/product/add");
  };
  const handleSearch = (e) => {
    if (e.keyCode === 13) {
      let target = e.target;
      console.log(e.target.value);
      setPage(0);
      setSearchParams({ ...searchParams, productName: target.value });
      searchProduct({ ...searchParams, productName: target.value });
    }
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const handleChangeCategory = (value) => {
    setSelectedCategory(value);
    setPage(0);
    setSearchParams({
      ...searchParams,
      categoryId: value ? value?.value : value,
    });
    searchProduct({
      ...searchParams,
      categoryId: value ? value?.value : value,
    });
    console.log("changeCategory", value);
  };
  const handleChangeManufactor = (value) => {
    setSelectedManufactor(value);
    setPage(0);
    setSearchParams({
      ...searchParams,
      manufactorId: value ? value?.value : value,
    });
    searchProduct({
      ...searchParams,
      manufactorId: value ? value?.value : value,
    });
    console.log("changeManufactor", value);
  };
  const fetchCategoryList = async () => {
    try {
      const params = {
        categoryName: "",
      };
      const actionResult = await CategoryService.getCategoryList(params);
      if (actionResult.data) {
        setCategoryList(actionResult.data.category);
      }
    } catch (error) {
      console.log("Failed to fetch category list: ", error);
    }
  };
  const fetchManufacturerList = async () => {
    try {
      const actionResult = await ManfacuturerService.getAllManufacturer();
      if (actionResult.data) {
        setManufactureList(actionResult.data.manufacturer);
      }
    } catch (error) {
      console.log("Failed to fetch category list: ", error);
    }
  };
  const fetchProductList = async () => {
    try {
      const params = {
        pageIndex: page + 1,
        pageSize: rowsPerPage,
        ...searchParams,
      };
      const actionResult = await ProductService.getAllProductList(params);
      if (actionResult.data) {
        setTotalRecord(actionResult.data.totalRecord);
        setProductList(actionResult.data.product);
      }
    } catch (error) {
      console.log("Failed to fetch category list: ", error);
    }
  };
  const searchProduct = async (searchParams) => {
    try {
      const params = {
        pageIndex: page + 1,
        pageSize: rowsPerPage,
        productName: searchParams.productName
          ? FormatDataUtils.removeExtraSpace(searchParams.productName)
          : "",
        productCode: searchParams.productCode,
        manufactorId: searchParams.manufactorId,
        categoryId: searchParams.categoryId,
      };
      const actionResult = await ProductService.getAllProductList(params);
      if (actionResult.data) {
        setTotalRecord(actionResult.data.totalRecord);
        setProductList(actionResult.data.product);
      }
    } catch (error) {
      console.log("Failed to fetch product list: ", error);
    }
  };
  useEffect(() => {
    fetchProductList();
    fetchCategoryList();
    fetchManufacturerList();
  }, [page, rowsPerPage]);

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
        <Grid xs={12} item>
          <Card className="panelFilter">
            <Box className="filterTitle">
              <Typography variant="p">Tìm kiếm thông tin sản phẩm</Typography>
            </Box>
            <Formik
              initialValues={{
                productCode: "",
                categoryId: "",
                manufactorId: "1",
                sort: "asc",
              }}
            >
              <Form>
                <Box className="toolbarContainer">
                  <Box className="searchField">
                    <TextfieldWrapper
                      id="outlined-basic"
                      name="productName"
                      placeholder="Tìm kiếm theo tên sản phẩm"
                      fullWidth
                      label={null}
                      variant="outlined"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Search />
                          </InputAdornment>
                        ),
                      }}
                      onKeyDown={handleSearch}
                      // onChange={handleSearchChange}
                    />
                  </Box>
                  <Stack
                    direction="row"
                    spacing={2}
                    justifyContent="flex-end"
                    className="selectBoxContainer"
                  >
                    {categoryList && (
                      <Select
                        classNamePrefix="select"
                        className="selectBox"
                        placeholder="Danh mục"
                        noOptionsMessage={() => (
                          <>Không có tìm thấy danh mục phù hợp</>
                        )}
                        isClearable={true}
                        isSearchable={true}
                        name="categoryId"
                        value={selectedCategory}
                        options={FormatDataUtils.getOptionWithIdandName(
                          categoryList
                        )}
                        menuPortalTarget={document.body}
                        styles={{
                          menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                          control: (base) => ({
                            ...base,
                            height: 56,
                            minHeight: 56,
                          }),
                        }}
                        onChange={(e) => handleChangeCategory(e)}
                      />
                    )}
                    {manufacturerList && (
                      <Select
                        classNamePrefix="select"
                        className="selectBox"
                        placeholder="Nhà cung cấp"
                        noOptionsMessage={() => (
                          <>Không có tìm thấy nhà cung cấp phù hợp</>
                        )}
                        isClearable={true}
                        isSearchable={true}
                        name="categoryId"
                        value={selectedManufactor}
                        options={FormatDataUtils.getOptionWithIdandName(
                          manufacturerList
                        )}
                        menuPortalTarget={document.body}
                        styles={{
                          menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                          control: (base) => ({
                            ...base,
                            height: 56,
                            minHeight: 56,
                          }),
                        }}
                        onChange={(e) => handleChangeManufactor(e)}
                      />
                    )}
                  </Stack>
                </Box>
              </Form>
            </Formik>
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
                {productList.map((row) => (
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
                        {FormatDataUtils.truncate(row.manufactorName, 20)}
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
          <CustomTablePagination
            page={page}
            pages={pages}
            rowsPerPage={rowsPerPage}
            totalRecord={totalRecord}
            handleChangePage={handleChangePage}
            handleChangeRowsPerPage={handleChangeRowsPerPage}
          />
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProductList;
