import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import {
  Card,
  Box,
  Button,
  Container,
  Grid,
  InputAdornment,
  Stack,
  TextField,
  Toolbar,
  FormGroup,
  Checkbox,
  FormControlLabel
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { Search } from "@mui/icons-material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import CustomTablePagination from "../../component/common/Pagination/index";
import ImportOrdersTable from "./ImportOrdersTable";
import "./ImportList.scss";
import importOrderService from "../../service/ImportOrderService";

const ImportList = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const pages = [5, 10, 20];
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalRecord, setTotalRecord] = useState();
  const [importOrderList, setImportOrderList] = useState([]);
  const [selectPending, setSelectPending] = useState(false);
  const navigate = useNavigate();

  const handleOnClickCreateImportOrder = () => {
    navigate("/import/create-order");
  };
  const [searchParams, setSearchParams] = useState({
    dateFrom: "",
    dateTo: "",
  });
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const handleChangeCheckboxPending = () => {
    setPage(0);
    setSearchParams({
      ...searchParams,
      status: selectPending === false ? 1 : "",
    });
    searchImportOrder({
      ...searchParams,
      status: selectPending === false ? 1 : "",
    });
    setSelectPending(!selectPending);
  };
  const handleChangeStartDate = (value) => {
    setStartDate(value);
    setPage(0);
    console.log("startDate", format(new Date(value), "yyyy-MM-dd HH:mm:ss"));
    setSearchParams({
      ...searchParams,
      dateFrom: value !== null ? format(new Date(value), "yyyy-MM-dd HH:mm:ss") : null,
    });
    searchImportOrder({
      ...searchParams,
      dateFrom: value !== null ? format(new Date(value), "yyyy-MM-dd HH:mm:ss") : null,
    });
  };
  const handleSearch = (e) => {
    if (e.keyCode === 13) {
      console.log(e.target.value);
      setPage(0);
      setSearchParams({ ...searchParams });
      searchImportOrder({ ...searchParams});
    }
  };

  const handleChangeEndDate = (value) => {
    setEndDate(value);
    setPage(0);
    console.log("endDate", format(new Date(value), "yyyy-MM-dd HH:mm:ss"));
    setSearchParams({
      ...searchParams,
      dateTo: value !== null ? format(new Date(value), "yyyy-MM-dd HH:mm:ss") : null,
    });
    searchImportOrder({
      ...searchParams,
      dateTo: value !== null ? format(new Date(value), "yyyy-MM-dd HH:mm:ss") : null,
    });
  };
  const searchImportOrder = async (searchParams) => {
    try {
      const params = {
        pageIndex: page + 1,
        pageSize: rowsPerPage,
        ...searchParams,
      };
      const dataResult = await importOrderService.getImportOrderList(params);
      //const dataResult = unwrapResult(actionResult);
      console.log("dataResult", dataResult);
      if (dataResult.data) {
        setTotalRecord(dataResult.data.totalRecord);
        setImportOrderList(dataResult.data.orderList);
      }
    } catch (error) {
      console.log("Failed to search export order list: ", error);
    }
  };
  const fetchImportOrderList = async () => {
    try {
      const params = {
        pageIndex: page + 1,
        pageSize: rowsPerPage,
      };
      const dataResult = await importOrderService.getImportOrderList(params);
      //const dataResult = unwrapResult(actionResult);
      console.log("dataResult", dataResult);
      if (dataResult.data) {
        setTotalRecord(dataResult.data.totalRecord);
        setImportOrderList(dataResult.data.orderList);
        //console.log(dataResult.data.orderList);
      }
    } catch (error) {
      console.log("Failed to fetch importOrder list: ", error);
    }
  };
  useEffect(() => {
    fetchImportOrderList();
    searchImportOrder(searchParams);
  }, [page, rowsPerPage]);

  return (
    <Container maxWidth="xl">
      <Stack direction="row" justifyContent="flex-end" spacing={2} p={2}>
        <Button
          variant="contained"
          color="success"
          startIcon={<AddIcon />}
          onClick={handleOnClickCreateImportOrder}
        >
          Tạo phiếu nhập kho
        </Button>
      </Stack>
      <Card className="panelFilter">
        <div className="labelPanelFilter">Tìm kiếm theo thông tin</div>
        <Toolbar className="toolbar">
          <TextField
            id="outlined-basic"
            placeholder="Tìm kiếm phiếu nhập kho"
            label={null}
            variant="outlined"
            className="searchField"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            onKeyDown={handleSearch}
            onChange={(e) => {
              setSearchParams({
                ...searchParams,
                orderCode: e.target.value,
              });
            }}
          />
        </Toolbar>
        <div>
          <div className="labelDateRange">Khoảng thời gian tạo đơn</div>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Toolbar>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  id="startDate"
                  label="Ngày bắt đầu"
                  value={startDate}
                  inputFormat="dd/MM/yyyy"
                  onChange={(newValue) => {
                    handleChangeStartDate(newValue);
                  }}
                  renderInput={(params) => <TextField {...params} />}
                />
                <Box sx={{ mx: 2 }}> Đến </Box>
                <DatePicker
                  id="endDate"
                  label="Ngày kết thúc"
                  inputFormat="dd/MM/yyyy"
                  value={endDate}
                  onChange={(newValue) => {
                    handleChangeEndDate(newValue);
                  }}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
            </Toolbar>
            <Box>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectPending}
                      onChange={() => handleChangeCheckboxPending()}
                    />
                  }
                  label="Chỉ hiển thị đơn hàng đang được xử lý"
                  className="labelCheckbox"
                />
              </FormGroup>
            </Box>
          </Stack>
        </div>
      </Card>
      <Grid xs={12} item>
         <ImportOrdersTable importOrderList={importOrderList} /> 
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
    </Container>
  );
};

export default ImportList;
