import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { toast } from "react-toastify";
import Label from "../../component/common/Label/index";
import StaffService from "../../service/StaffService";
import { PersonSearch, Search } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  InputAdornment,
  Stack,
  TextField,
} from "@mui/material";
import CustomTablePagination from "../../component/common/Pagination/index";
import "./StaffList.css";
import FormatDataUtils from "../../utils/FormatDataUtils";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
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
const StaffList = () => {
  const [staffList, setStaffList] = useState([]);
  const pages = [10, 20, 50];
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalRecord, setTotalRecord] = useState();
  const [keyword, setKeyword] = useState();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useState({
    staffName: "",
  });
  const [searchBy, setSearchBy] = useState('staffName');

  const handleOnClickDetail = (staffId) => {
    navigate(`/staff/detail/${staffId}`);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleSearchChange = (e) => {
    console.log(e.target.value)
    setKeyword(e.target.value);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = (e) => {
    setPage(0)
    searchStaff({ ...searchParams, staffName: FormatDataUtils.removeExtraSpace(keyword), searchBy: searchBy });
    setSearchParams({ ...searchParams, staffName: FormatDataUtils.removeExtraSpace(keyword), searchBy: searchBy });
  };

  const searchStaff = async (searchParams) => {
    try {
      const params = {
        pageIndex: page + 1,
        pageSize: rowsPerPage,
        ...searchParams,
      };
      const dataResult = await StaffService.getStaffList(params);
      console.log("dataResult", dataResult);
      if (dataResult) {
        setTotalRecord(dataResult.data.totalRecord);
        setStaffList(dataResult.data.staff);
      }
    } catch (error) {
      console.log("Failed to search staff list: ", error);
    }
  };
  const fetchStaffList = async () => {
    try {
      const params = {
        pageIndex: page + 1,
        pageSize: rowsPerPage,
      };
      const dataResult = await StaffService.getStaffList(params);
      //const dataResult = unwrapResult(actionResult);
      console.log("dataResult", dataResult);
      if (dataResult) {
        setTotalRecord(dataResult.data.totalRecord);
        setStaffList(dataResult.data.staff);
      }
    } catch (error) {
      console.log("Failed to fetch staff list: ", error);
    }
  };
  useEffect(() => {
    searchStaff(searchParams);
    fetchStaffList();
  }, [page, rowsPerPage]);

  return (
    <Grid container spacing={2}>
      <Grid xs={12} item>
        <Card>
          <CardHeader title="Tìm kiếm thông tin nhân viên" />
          <Stack direction="row" spacing={2} p={2}>
            <TextField
              id="outlined-basic"
              name="keyword"
              placeholder="Tìm kiếm nhân viên"
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
                sx={{ width: "20%" }}
                variant="contained"
                startIcon={<PersonSearch />}
                className="btnSearch"
                onClick={handleSearch}
              >
                Tìm kiếm
              </Button>
          </Stack>
        </Card>
      </Grid>
      <Grid xs={12} item>
        <Card>
          <CardHeader title="Nhân viên" />
          <CardContent>
            <Box>
              {totalRecord > 0 ? (
                <TableContainer>
                  {staffList && staffList.length > 0 && (
                    <Table>
                      <TableHead component={Paper}>
                        <TableRow sx={{ minWidth: 200 }} aria-label="customized table">
                          <StyledTableCell align="center">Tên Nhân viên</StyledTableCell>
                          <StyledTableCell align="center">Ảnh</StyledTableCell>
                          <StyledTableCell align="center">Số điện thoại</StyledTableCell>
                          <StyledTableCell align="center">Chức vụ</StyledTableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {staffList.map((staff) => {
                          return (
                            <TableRow
                              key={staff.id}
                              hover
                              onClick={() => handleOnClickDetail(staff.id)}
                            >
                              <TableCell align="center">
                                {staff.fullName}
                              </TableCell>
                              <TableCell align="center">
                                <img
                                  // component="img"
                                  // height="250"
                                  // sx={{ width: 250 }}
                                  className="imgStaff"
                                  alt="Ảnh sản phẩm"
                                  // src={image}
                                  loading="lazy"
                                  src={`/image/${staff.image}`}
                                />
                                
                              </TableCell>
                              <TableCell align="center">
                                {staff.phone}
                              </TableCell>
                              <TableCell align="center">{staff.role}</TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  )}
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
                <>Không tìm thấy nhân viên phù hợp</>
              )}
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default StaffList;
