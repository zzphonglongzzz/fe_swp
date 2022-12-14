import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import ExportOrderService from "../../service/ExportOrderService";
import { Search } from '@mui/icons-material';
import {
  Box,
  Card,
  CardContent,
  Grid,
  InputAdornment,
  Stack,
  Table,
  TableBody,
  TextField,
  Typography,
} from '@mui/material';
import { format } from 'date-fns';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import FormatDataUtils from "../../utils/FormatDataUtils";
import CustomTablePagination from "../../component/common/Pagination/index"
import { styled } from "@mui/material/styles";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));
const ReturnList = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [returnOrderList, setReturnOrderList] = useState([]);
  const [searchParams, setSearchParams] = useState({});
  const pages = [10, 20, 50];
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(pages[page]);
  const [totalRecord, setTotalRecord] = useState(0);
  const navigate = useNavigate();
  
  const handleSearch = (e) => {
    if (e.keyCode === 13) {
      let target = e.target;
      console.log(e.target.value);
      setPage(0);
      setSearchParams({ ...searchParams, orderCode: target.value });
      searchReturnOrderList({ ...searchParams, orderCode: target.value });
    }
  };

  const handleChangeStartDate = (value) => {
    setStartDate(value);
    setPage(0);
    console.log('startDate', format(new Date(value), 'yyyy-MM-dd HH:mm:ss'));
    setSearchParams({
      ...searchParams,
      dateFrom: value !== null ? format(new Date(value), 'yyyy-MM-dd HH:mm:ss') : null,
    });
    searchReturnOrderList({
      ...searchParams,
      dateFrom: value !== null ? format(new Date(value), 'yyyy-MM-dd HH:mm:ss') : null,
    });
  };

  const handleChangeEndDate = (value) => {
    setEndDate(value);
    setPage(0);
    console.log('endDate', format(new Date(value), 'yyyy-MM-dd HH:mm:ss'));
    setSearchParams({
      ...searchParams,
      dateTo: value !== null ? format(new Date(value), 'yyyy-MM-dd HH:mm:ss') : null,
    });
    searchReturnOrderList({
      ...searchParams,
      dateTo: value !== null ? format(new Date(value), 'yyyy-MM-dd HH:mm:ss') : null,
    });
  };
  const handleOnClickTableRow = (returnOrderId) => {
    navigate(`/export/return/detail/${returnOrderId}`);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    // fetchProductList(newPage, rowsPerPage, searchParams);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    // fetchProductList(page, parseInt(event.target.value, 10), searchParams);
  };
  const searchReturnOrderList = async (searchParams) => {
    try {
      const params = {
        pageIndex: page + 1,
        pageSize: rowsPerPage,
        ...searchParams,
      };
      const dataResult = await ExportOrderService.getReturnOrderList(params);
      //const dataResult = unwrapResult(actionResult);
      console.log('dataResult', dataResult);
      if (dataResult.data) {
        setTotalRecord(dataResult.data.totalRecord);
        setReturnOrderList(dataResult.data.orderReturnList);
      }
    } catch (error) {
      console.log('Failed to fetch returnOrder list: ', error);
    }
  };
  const fetchReturnOrderList = async () => {
    try {
      const params = {
        pageIndex: page + 1,
        pageSize: rowsPerPage,
        ...searchParams,
      };
      const dataResult = await ExportOrderService.getReturnOrderList(params);
      //const dataResult = unwrapResult(actionResult);
      console.log('dataResult', dataResult);
      if (dataResult.data) {
        setTotalRecord(dataResult.data.totalRecord);
        setReturnOrderList(dataResult.data.orderReturnList);
      }
    } catch (error) {
      console.log('Failed to fetch returnOrder list: ', error);
    }
  };
  useEffect(() => {
    searchReturnOrderList(searchParams);
    fetchReturnOrderList();
  }, [page, rowsPerPage]);

  return (
    <Grid
      container
      spacing={2}
    >
      <Grid
        xs={12}
        item
      >
        <Card>
          <CardContent>
            <Typography variant="h6">T??m ki???m theo th??ng tin</Typography>
            <Stack
              direction="row"
              py={2}
              justifyContent="space-between"
            >
              <TextField
                id="outlined-basic"
                name="productName"
                width={35}
                placeholder="M?? phi???u xu???t"
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
                onChange={(e) => {
                  setSearchParams({ ...searchParams, orderCode: e.target.value });
                }}
              />
              {/* <Box width={35}>
                <FormControl fullWidth>
                  <InputLabel id="select-creator">Ng?????i t???o ????n</InputLabel>
                  <Select
                    id="creator"
                    value={creatorId}
                    label="Ng?????i t???o ????n"
                    onChange={handleChangeCreator}
                  >
                    {staffList.map((item) => (
                      <MenuItem
                        key={item.id}
                        value={item.id}
                      >
                        {item.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box> */}
            </Stack>
            <Typography variant="h6">Kho???ng th???i gian t???o ????n</Typography>
            <Stack
              direction="row"
              py={2}
              alignItems='center'
            >
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  id="startDate"
                  label="Ng??y b???t ?????u"
                  value={startDate}
                  inputFormat="dd/MM/yyyy"
                  onChange={(newValue) => {
                    handleChangeStartDate(newValue);
                  }}
                  renderInput={(params) => <TextField {...params} />}
                />
                <Box sx={{ mx: 2 }}> ?????n </Box>
                <DatePicker
                  id="endDate"
                  label="Ng??y k???t th??c"
                  inputFormat="dd/MM/yyyy"
                  value={endDate}
                  onChange={(newValue) => {
                    handleChangeEndDate(newValue);
                  }}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
            </Stack>
          </CardContent>
        </Card>
      </Grid>
      <Grid
        xs={12}
        item
      >
        <Card>
          <CardContent>
            
              <Box>
                {totalRecord > 0 ? (
                  <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 200 }} aria-label="customized table">
                      <TableHead>
                        <TableRow>
                          <StyledTableCell align="center">Ng??y t???o</StyledTableCell>
                          <StyledTableCell align="center">???????c tr??? t??? m?? xu???t kho</StyledTableCell>
                          <StyledTableCell align="center">Gi?? tr??? ????n h??ng</StyledTableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {returnOrderList &&
                          returnOrderList.map((returnOrder, index) => (
                            <TableRow
                              hover
                              key={returnOrder?.id}
                              onClick={() => handleOnClickTableRow(returnOrder.id)}
                            >
                              <TableCell align="center">
                                {returnOrder.created_date
                                  ? FormatDataUtils.formatDate(returnOrder.created_date)
                                  : 'Kh??ng c??'}
                              </TableCell>
                              <TableCell align="center">
                                {"XUAT" + returnOrder.order_code}
                              </TableCell>
                              <TableCell align="center">
                                {FormatDataUtils.formatCurrency(returnOrder?.total_price) || 0}
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                    <CustomTablePagination
                      page={page}
                      pages={pages}
                      rowsPerPage={rowsPerPage}
                      totalRecord={totalRecord}
                      handleChangePage={handleChangePage}
                      handleChangeRowsPerPage={handleChangeRowsPerPage}
                    />
                  </TableContainer>
                 ) : (
                  <Box>Kh??ng t??m th???y k???t qu??? n??o</Box>
                )} 
              </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default ReturnList;
