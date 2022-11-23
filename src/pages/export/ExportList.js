import { useState, useEffect } from "react";
import AuthService from "../../service/AuthService";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import {
  Grid,
  Container,
  Stack,
  Button,
  Card,
  Toolbar,
  Box,
  TextField,
  InputAdornment,
  FormGroup,
  Checkbox,
  FormControlLabel
} from "@mui/material";
import { Add, Search } from "@mui/icons-material";
import CustomTablePagination from "../../component/common/Pagination";
import ExportOrderTable from "./ExportOrderTable";
import './ExportList.scss'

const ExportList = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const pages = [5, 10, 15];
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalRecord, setTotalRecord] = useState();
  const [creatorId, setCreatorId] = useState("");
  const [exportOrderList, setExportOrderList] = useState();
  const [staffList, setStaffList] = useState([]);
  const [selectPending, setSelectPending] = useState(false);
  const navigate = useNavigate();
  const currentUserRole = AuthService.getCurrentUser().roles[0];
  const [searchParams, setSearchParams] = useState({
    startDate: "",
    endDate: "",
  });
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const handleOnClickCreateExportOrder = () => {
    navigate("/export/create-order");
  };
  const handleChangeCheckboxPending = () => {
    setPage(0);
    setSearchParams({
      ...searchParams,
      status: selectPending === false ? 1 : "",
    });
    // searchExportOrder({
    //   ...searchParams,
    //   status: selectPending === false ? 1 : "",
    // });
    setSelectPending(!selectPending);
  };

  const handleSearch = (e) => {
    if (e.keyCode === 13) {
      let target = e.target;
      console.log(e.target.value);
      setPage(0);
      setSearchParams({ ...searchParams });
     // searchExportOrder({ ...searchParams });
    }
  };
  const handleChangeStartDate = (value) => {
    setStartDate(value);
    setPage(0);
    console.log("startDate", format(new Date(value), "dd-MM-yyyy"));
    setSearchParams({
      ...searchParams,
      startDate: value !== null ? format(new Date(value), "dd-MM-yyyy") : null,
    });
    // searchExportOrder({
    //   ...searchParams,
    //   startDate: value !== null ? format(new Date(value), "dd-MM-yyyy") : null,
    // });
  };

  const handleChangeEndDate = (value) => {
    setEndDate(value);
    setPage(0);
    console.log("endDate", format(new Date(value), "dd-MM-yyyy"));
    setSearchParams({
      ...searchParams,
      endDate: value !== null ? format(new Date(value), "dd-MM-yyyy") : null,
    });
    // searchExportOrder({
    //   ...searchParams,
    //   endDate: value !== null ? format(new Date(value), "dd-MM-yyyy") : null,
    // });
  };
  // const searchExportOrder = async (searchParams) => {
  //   try {
  //     const params = {
  //       pageIndex: page,
  //       pageSize: rowsPerPage,
  //       ...searchParams,
  //     };
  //     const actionResult = await dispatch(getExportOrderList(params));
  //     const dataResult = unwrapResult(actionResult);
  //     console.log("dataResult", dataResult);
  //     if (dataResult.data) {
  //       setTotalRecord(dataResult.data.totalRecord);
  //       setExportOrderList(dataResult.data.orderList);
  //     }
  //   } catch (error) {
  //     console.log("Failed to search export order list: ", error);
  //   }
  // };
  // const fetchExportOrderList = async () => {
  //   try {
  //     const params = {
  //       pageIndex: page,
  //       pageSize: rowsPerPage,
  //     };
  //     const actionResult = await dispatch(getExportOrderList(params));
  //     const dataResult = unwrapResult(actionResult);
  //     console.log("dataResult", dataResult);
  //     if (dataResult.data) {
  //       setTotalRecord(dataResult.data.totalRecord);
  //       setExportOrderList(dataResult.data.orderList);
  //     }
  //   } catch (error) {
  //     console.log("Failed to fetch exportOrder list: ", error);
  //   }
  // };
  useEffect(() => {
    //searchExportOrder(searchParams);
   // fetchExportOrderList();
  }, [page, rowsPerPage]);

  return (
    <Container maxWidth="xl">
      <Stack direction="row" justifyContent="flex-end" spacing={2} p={2}>
          <Button
            variant="contained"
            color="success"
            startIcon={<Add />}
            onClick={handleOnClickCreateExportOrder}
          >
            Tạo phiếu xuất kho
          </Button>
        </Stack>
      {/* {(currentUserRole === "ROLE_OWNER" ||
        currentUserRole === "ROLE_SELLER") && (
        <Stack direction="row" justifyContent="flex-end" spacing={2} p={2}>
          <Button
            variant="contained"
            color="success"
            startIcon={<Add />}
            onClick={handleOnClickCreateExportOrder}
          >
            Tạo phiếu xuất kho
          </Button>
        </Stack>
      )} */}
      <Card className="panelFilter">
        <div className="labelPanelFilter">Tìm kiếm theo thông tin</div>
        <Toolbar className="toolbar">
          <TextField
            id="outlined-basic"
            placeholder="Tìm kiếm phiếu xuất kho"
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
              <LocalizationProvider dateAdapter="AdapterDateFns">
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
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="stretch"
        marginTop={1}
        spacing={3}
      >
        <Grid item xs={12}>
          <Card className="cardStyle">
            <Box>
              {totalRecord > 0 ? (
                <ExportOrderTable exportOrders={exportOrderList} />
              ) : (
                <>Không tìm thấy phiếu xuất kho phù hợp</>
              )}
              {!!totalRecord && (
                <CustomTablePagination
                  page={page}
                  pages={pages}
                  rowsPerPage={rowsPerPage}
                  totalRecord={totalRecord}
                  handleChangePage={handleChangePage}
                  handleChangeRowsPerPage={handleChangeRowsPerPage}
                />
              )}
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ExportList;
