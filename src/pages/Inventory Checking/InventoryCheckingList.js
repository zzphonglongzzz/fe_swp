import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import WarehouseService from "../../service/WarehouseService";
import {
  Autocomplete,
  Box,
  Card,
  CardContent,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import FormatDataUtils from "../../utils/FormatDataUtils";
import { format } from "date-fns";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import CustomTablePagination from "../../component/common/Pagination/index";
import "./CreateInventoryChecking.scss";
import InventoryCheckingService from "../../service/InventoryCheckingService";

const sortByList = [
  { id: 1, name: "Ngày tạo mới nhất" },
  { id: 2, name: "Ngày tạo cũ nhất" },
  { id: 3, name: "Chênh lệch lớn nhất" },
  { id: 4, name: "Chênh lệch nhỏ nhất" },
];

const InventoryCheckingList = () => {
  const [creatorId, setCreatorId] = useState("");
  const [warehouseId, setWarehouseId] = useState("");
  const [sortById, setSortById] = useState(1);
  const [warehouseList, setWarehouseList] = useState([]);
  const [inventoryCheckingList, setInventoryCheckingList] = useState([]);
  const [searchParams, setSearchParams] = useState({});
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const pages = [10, 20, 50];
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(pages[page]);
  const [totalRecord, setTotalRecord] = useState(0);
  const [staffList, setStaffList] = useState([]);
  const navigate = useNavigate();

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  
  const handleChangeWarehouse = (event) => {
    setPage(0);
    setWarehouseId(event.target.value);
    setSearchParams({
      ...searchParams,
      wareHouseId: event.target.value > 0 ? event.target.value : "",
    });
    searchInventoryChecking({
      ...searchParams,
      wareHouseId: event.target.value > 0 ? event.target.value : "",
    });
  };
  const handleChangeStartDate = (value) => {
    setStartDate(value);
    setPage(0);
    console.log("startDate", format(new Date(value), "yyyy-MM-dd"));
    setSearchParams({
      ...searchParams,
      startDate: value !== null ? format(new Date(value), "yyyy-MM-dd") : null,
    });
    searchInventoryChecking({
      ...searchParams,
      startDate: value !== null ? format(new Date(value), "yyyy-MM-dd") : null,
    });
  };
  const handleChangeEndDate = (value) => {
    setEndDate(value);
    setPage(0);
    console.log("endDate", format(new Date(value), "yyyy-MM-dd"));
    setSearchParams({
      ...searchParams,
      endDate: value !== null ? format(new Date(value), "yyyy-MM-dd") : null,
    });
    searchInventoryChecking({
      ...searchParams,
      endDate: value !== null ? format(new Date(value), "yyyy-MM-dd") : null,
    });
  };
  const handleChangeSortBy = (event) => {
    setPage(0);
    setSortById(event.target.value);
    switch (event.target.value) {
      case 1:
        setSearchParams({
          ...searchParams,
          orderBy: "createDate",
          order: "desc",
        });
        searchInventoryChecking({
          ...searchParams,
          orderBy: "createDate",
          order: "desc",
        });
        break;
      case 2:
        setSearchParams({
          ...searchParams,
          orderBy: "createDate",
          order: "asc",
        });
        searchInventoryChecking({
          ...searchParams,
          orderBy: "createDate",
          order: "asc",
        });
        break;
      case 3:
        setSearchParams({
          ...searchParams,
          orderBy: "totalDifferentAmout",
          order: "desc",
        });
        searchInventoryChecking({
          ...searchParams,
          orderBy: "totalDifferentAmout",
          order: "desc",
        });
        break;
      case 4:
        setSearchParams({
          ...searchParams,
          orderBy: "totalDifferentAmout",
          order: "asc",
        });
        searchInventoryChecking({
          ...searchParams,
          orderBy: "totalDifferentAmout",
          order: "asc",
        });
        break;
      default:
        break;
    }
  };
  const getAllWarehouse = async () => {
    try {
      const dataResult = await WarehouseService.getlistWarehouse();
      console.log("warehouse list", dataResult.data);
      if (dataResult.data) {
        setWarehouseList(
          [{ id: 0, name: "Tất cả" }].concat(dataResult.data.warehouses)
        );
      }
    } catch (error) {
      console.log("Failed to fetch warehouse list: ", error);
    }
  };
  const searchInventoryChecking = async (searchParams) => {
    try {
      const params = {
        pageIndex: page + 1,
        pageSize: rowsPerPage,
        orderBy: "createDate",
        order: "desc",
        ...searchParams,
      };
      const dataResult = await InventoryCheckingService.getListInventoryChecking();
      // const dataResult = unwrapResult(actionResult);
      console.log("dataResult", dataResult);
      if (dataResult.data) {
        setTotalRecord(dataResult.data.totalRecord);
        setInventoryCheckingList(dataResult.data.listStockTakingHistory);
      }
    } catch (error) {
      console.log("Failed to fetch inventoryChecking list: ", error);
    }
  };
  const fetchInventoryCheckingList = async () => {
    try {
      const params = {
        pageIndex: page + 1,
        pageSize: rowsPerPage,
        order: "desc",
        orderBy: "createDate",
      };
      const dataResult = await InventoryCheckingService.getListInventoryChecking();
      //const dataResult = unwrapResult(actionResult);
      console.log("dataResult", dataResult);
      if (dataResult.data) {
        setTotalRecord(dataResult.data.totalRecord);
        setInventoryCheckingList(dataResult.data.listStockTakingHistory);
      }
    } catch (error) {
      console.log("Failed to fetch inventoryChecking list: ", error);
    }
  };
  useEffect(() => {
    searchInventoryChecking(searchParams);
  }, [page, rowsPerPage]);

  useEffect(() => {
    getAllWarehouse();
    fetchInventoryCheckingList();
  }, []);
  return (
    <Grid container spacing={2}>
      <Grid xs={12} item>
        <Card>
          <CardContent>
            <Typography variant="h6">Tìm kiếm theo thông tin</Typography>
            <Stack direction="row" justifyContent="space-between" py={2}>
              <Box className="selectBox">
                <FormControl fullWidth>
                  <InputLabel id="select-creator">Kho kiểm</InputLabel>
                  {warehouseList && (
                    <Select
                      id="creator"
                      value={warehouseId}
                      label="Kho kiểm"
                      onChange={handleChangeWarehouse}
                    >
                      {warehouseList.map((item) => (
                        <MenuItem key={item.id} value={item.id}>
                          {item.name}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                </FormControl>
              </Box>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="h6">Khoảng thời gian tạo đơn</Typography>
              <Typography variant="h6" className="sortBy">
                Sắp xếp theo
              </Typography>
            </Stack>
            <Stack direction="row" py={2} justifyContent="space-between">
              <Stack direction="row">
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
              </Stack>
              <Box className="selectBox">
                <FormControl fullWidth>
                  {/* <InputLabel id="select-creator">Sắp xếp theo</InputLabel> */}
                  <Select
                    id="creator"
                    value={sortById}
                    // label="Sắp xếp theo"
                    onChange={handleChangeSortBy}
                  >
                    {sortByList.map((item) => (
                      <MenuItem key={item.id} value={item.id}>
                        {item.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Grid>
      <Grid xs={12} item>
        <Card>
          <CardContent>
            {totalRecord > 0 ? (
              <TableContainer>
                <Table className="table">
                  <TableHead>
                    <TableRow>
                      <TableCell align="center">Kho</TableCell>
                      <TableCell align="center">Ngày kiểm kho</TableCell>
                      <TableCell align="center">Người kiểm kho</TableCell>
                      <TableCell align="center">Tổng chênh lệch</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {inventoryCheckingList &&
                      inventoryCheckingList.map((inventoryChecking) => (
                        <TableRow
                          hover
                          key={inventoryChecking.id}
                          onClick={() =>
                            navigate(
                              `/inventory-checking/detail/${inventoryChecking.id}`
                            )
                          }
                        >
                          <TableCell align="center">
                            {inventoryChecking.wareHouseName}
                          </TableCell>
                          <TableCell align="center">
                            {FormatDataUtils.formatDate(
                              inventoryChecking.createDate
                            )}
                          </TableCell>
                          <TableCell align="center">
                            {inventoryChecking.userName}
                          </TableCell>
                          <TableCell align="center">
                            {FormatDataUtils.formatCurrency(
                              inventoryChecking.differentAmount
                            )}
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
              <>Không tìm thấy phiếu kiểm kho phù hợp</>
            )}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default InventoryCheckingList;
