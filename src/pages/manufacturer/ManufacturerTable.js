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
  Box,
} from "@mui/material";
import { Add, Search } from "@mui/icons-material";
import SearchIcon from "@mui/icons-material/Search";

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
  const [keyword, setKeyword] = useState();

  const handleOnClickDetailManufacturer = (manufacturerId) => {
    console.log("Id: ", manufacturerId);
    navigate(`/manufacturer/detail/${manufacturerId}`);
  };
  const handleOnclickAddNewManufacturer = () => {
    navigate("/manufacturer/add");
  };
  const handleSearch = (e) => {
    setKeyword(e.target.value);
  };
  const handleSearchChange = (e) => {
    console.log(e.target.value);
  };
  useEffect(() => {
    ManufacturerService.getAllManufacturer()
      .then((response) => {
        setManufactureList(response.data);
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
                onChange={handleSearchChange}
              />
              <Button
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
      </Grid>
    </Container>
  );
};

export default ManufacturerTable;
