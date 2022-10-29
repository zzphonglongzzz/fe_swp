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
import { useNavigate } from "react-router-dom";
import { Typography } from "@mui/material";
import { useEffect, useState } from "react";
import ManufacturerService from "../../service/ManufacturerService";
import {
  Grid,
  Stack,
  Button,
  Card,
  CardHeader,
  TextField,
  InputAdornment,
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

const ManufacturerTable = () => {
  const navigate = useNavigate();
  const [manufacturerList, setManufactureList] = useState([]);
  //const [keyword, setKeyword] = useState();
  const [pageIndex, setPageIndex] = useState(1);
  const pageSize = 5;

  const count = Math.ceil(manufacturerList.length / pageSize);
  const _DATA = usePagination(manufacturerList, pageSize);

  const handleChange = (e, p) => {
    console.log(p)
    setPageIndex(p);
    _DATA.jump(p);
  };

  const handleOnClickDetailManufacturer = (manufacturerId) => {
    navigate(`/manufacturer/detail/${manufacturerId}`);
  };
  const handleOnclickAddNewManufacturer = () => {
    navigate("/manufacturer/add");
  };
  // const handleSearch = (e) => {
  //   setKeyword(e.target.value);
  // };
  // const handleSearchChange = (e) => {
  //   console.log(e.target.value);
  // };
  const fetchManufacturerList = async () => {
    try {
      const actionResult = await ManufacturerService.getManufacturerList();
      if (actionResult.data) {
        setManufactureList(actionResult.data.manufacturer);
      }
    } catch (error) {
      console.log("Failed to fetch category list: ", error);
    }
  };
  useEffect(() => {
    fetchManufacturerList();
  }, []);
  return (
    <Container maxWidth="xl">
      <Grid container spacing={2} justifyContent="flex-end">
        <Stack direction="row" spacing={1} paddingY={1}>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOnclickAddNewManufacturer()}
          >
            Thêm nhà sản xuất mới
          </Button>
        </Stack>
        <Grid xs={13} item>
          <Card>
            <CardHeader title="Tìm kiếm thông tin nhà sản xuất" />
            <Stack direction="row" spacing={2} padding={2}>
              <TextField
                id="outlined-basic"
                name="keyword"
                placeholder="Tìm kiếm theo tên nhà cung cấp..."
                sx={{ width: "80%" }}
                label={null}
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
                //onChange={handleSearchChange}
              />
              <Button
                sx={{ width: "20%" }}
                variant="contained"
                startIcon={<SearchIcon />}
                className="btnSearch"
                //onClick={handleSearch}
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
                  <StyledTableCell>Tên nhà sản xuất</StyledTableCell>
                  <StyledTableCell>Số điện thoại</StyledTableCell>
                  <StyledTableCell>Email</StyledTableCell>
                  <StyledTableCell align="center">Địa chỉ</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {_DATA.currentData().map((row) => (
                  <TableRow
                    hover
                    key={row.id}
                    onClick={() => handleOnClickDetailManufacturer(row.id)}
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
            page={pageIndex}
            variant="outlined"
            shape="rounded"
            onChange={handleChange}
          />
        </Grid>
      </Grid>
    </Container>
  );
};

export default ManufacturerTable;
