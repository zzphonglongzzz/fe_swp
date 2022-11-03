import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import {
  Autocomplete,
  Card,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  InputLabel,
  MenuItem,
  Select,
  Box,
  Button,
  Container,
  Grid,
  InputAdornment,
  Stack,
  TextField,
  Toolbar,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Search } from '@mui/icons-material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import CustomTablePagination from"../../component/common/Pagination/index"
import ImportOrderTable from "./ImportOrder";
import "./ImportList.scss"

const ImportList = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [creatorId, setCreatorId] = useState("");
  const [staffList, setStaffList] = useState([]);
  const pages = [10, 20, 50];
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalRecord, setTotalRecord] = useState();
  const [importOrderList, setImportOrderList] = useState();
  const navigate = useNavigate();
  const handleOnClickCreateImportOrder = () => {
    navigate("/import/create-order");
  };
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
  // const handleChangeStartDate = (value) => {
  //   setStartDate(value);
  //   setPage(0);
  //   console.log("startDate", format(new Date(value), "dd-MM-yyyy"));
  //   setSearchParams({
  //     ...searchParams,
  //     startDate: value !== null ? format(new Date(value), "dd-MM-yyyy") : null,
  //   });
  //   searchImportOrder({
  //     ...searchParams,
  //     startDate: value !== null ? format(new Date(value), "dd-MM-yyyy") : null,
  //   });
  // };
  const handleSearch = (e) => {
    if (e.keyCode === 13) {
      console.log(e.target.value);
      setPage(0);
      setSearchParams({ ...searchParams});
      //searchImportOrder({ ...searchParams});
    }
  };

  const handleChangeEndDate = (value) => {
    setEndDate(value);
    setPage(0);
    console.log("endDate", format(new Date(value), "dd-MM-yyyy"));
    setSearchParams({
      ...searchParams,
      endDate: value !== null ? format(new Date(value), "dd-MM-yyyy") : null,
    });
    // searchImportOrder({
    //   ...searchParams,
    //   endDate: value !== null ? format(new Date(value), "dd-MM-yyyy") : null,
    // });
  };
  // const searchImportOrder = async (searchParams) => {
  //   try {
  //     const params = {
  //       pageIndex: page,
  //       pageSize: rowsPerPage,
  //       ...searchParams,
  //     };
  //     const actionResult = await dispatch(getImportOrderList(params));
  //     const dataResult = unwrapResult(actionResult);
  //     console.log("dataResult", dataResult);
  //     if (dataResult.data) {
  //       setTotalRecord(dataResult.data.totalRecord);
  //       setImportOrderList(dataResult.data.orderList);
  //     }
  //   } catch (error) {
  //     console.log("Failed to search export order list: ", error);
  //   }
  // };
  // const fetchImportOrderList = async () => {
  //   try {
  //     const params = {
  //       pageIndex: page,
  //       pageSize: rowsPerPage,
  //     };
  //     const actionResult = await dispatch(getImportOrderList(params));
  //     const dataResult = unwrapResult(actionResult);
  //     console.log("dataResult", dataResult);
  //     if (dataResult.data) {
  //       setTotalRecord(dataResult.data.totalRecord);
  //       setImportOrderList(dataResult.data.orderList);
  //     }
  //   } catch (error) {
  //     console.log("Failed to fetch importOrder list: ", error);
  //   }
  // };
  useEffect(() => {
   // fetchImportOrderList();
   // searchImportOrder(searchParams);
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
              setSearchParams({ ...searchParams, billReferenceNumber: e.target.value });
            }}
          />
          <Box className="selectBox">
            {/* {staffList && (
              <Autocomplete
                id="combo-box-demo"
                options={staffList}
                getOptionLabel={(staff) => staff.name || ''}
                noOptionsText="Không tìm thấy người tạo đơn"
                onChange={(event, newInputValue) => {
                  handleChangeCreator(newInputValue);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Người tạo đơn"
                  />
                )}
              />
            )} */}
          </Box>
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
                  // onChange={(newValue) => {
                  //   handleChangeStartDate(newValue);
                  // }}
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
        <Grid
          item
          xs={12}
        >
          <Card className="cardStyle">
              <Box>
                {totalRecord > 0 ? (
                  <ImportOrderTable importOrders={importOrderList} />
                ) : (
                  <>Không tìm thấy phiếu nhập kho phù hợp</>
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

export default ImportList;
