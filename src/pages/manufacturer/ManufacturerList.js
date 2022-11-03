import * as React from "react";
import { Container } from "@mui/system";
import { useNavigate } from "react-router-dom";
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
import CustomTablePagination from "../../component/common/Pagination/index";
import ManufacturerTable from "./ManufacturerTable";
import FormatDataUtils from "../../utils/FormatDataUtils";


const ManufacturerList = () => {
  const navigate = useNavigate();
  const [manufacturerList, setManufactureList] = useState([]);
  const pages = [5, 10];
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(pages[page]);
  const [totalRecord, setTotalRecord] = useState(0);
  const [keyword, setKeyword] = useState();
  const [searchParams, setSearchParams] = useState({
    name: "",
  });
  const [searchBy, setSearchBy] = useState('name');
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (e) => {
    console.log(e.target.value)
    setKeyword(e.target.value);
  };

  const handleSearch = (e) => {
    setPage(0);
    searchManufacurer({ ...searchParams, name: FormatDataUtils.removeExtraSpace(keyword), searchBy: searchBy });
    setSearchParams({ ...searchParams, name: FormatDataUtils.removeExtraSpace(keyword), searchBy: searchBy });
  };

  const handleOnclickAddNewManufacturer = () => {
    navigate("/manufacturer/add");
  };

  const fetchManufacturerList = async () => {
    try {
      const params = {
        pageIndex: page + 1,
        pageSize: rowsPerPage,
      };
      const actionResult = await ManufacturerService.getManufacturerList(
        params
      );
      if (actionResult.data) {
        setTotalRecord(actionResult.data.totalRecord);
        setManufactureList(actionResult.data.manufacturer);
      }
    } catch (error) {
      console.log("Failed to fetch category list: ", error);
    }
  };
  const searchManufacurer = async (searchParams) => {
    try {
      const params = {
        pageIndex: page + 1,
        pageSize: rowsPerPage,
        ...searchParams,
      };
      const actionResult = await ManufacturerService.searchManufacturer(
        params
      );
      if (actionResult.data) {
        setTotalRecord(actionResult.data.totalRecord);
        setManufactureList(actionResult.data.manufacturer);
      }
    } catch (error) {
      console.log("Failed to fetch category list: ", error);
    }
  };
  useEffect(() => {
    searchManufacurer(searchParams);
    fetchManufacturerList();
  }, [page, rowsPerPage]);
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
                onChange={handleSearchChange}
              />
              <Button
                sx={{ width: "20%" }}
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
          <ManufacturerTable manufacturerList={manufacturerList} />
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

export default ManufacturerList;
