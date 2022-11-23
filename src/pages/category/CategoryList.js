import * as React from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import { useState, useEffect } from "react";
import CategoryService from "../../service/CategoryService";
import { Container } from "@mui/system";
import { useNavigate } from "react-router-dom";
import { Stack, Tooltip, IconButton, Box } from "@mui/material";
import { Edit } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import DiaLog from "../../component/common/dialog/index";
import AddCategory from "./AddCategory";
import EditCategory from "./EditCategory";
import VisibilityIcon from "@mui/icons-material/Visibility";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

export default function CategoryList() {
  const [categoryList, setCategoryList] = useState([]);
  const [openPopup, setOpenPopup] = useState(false);
  const [openPopupEdit, setOpenPopupEdit] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState();
  const navigate = useNavigate();

  const handleOnClickDetailCategory = (categoryId) => {
    navigate(`/category/subCategory/${categoryId}`);
  };
  const handleOnclickAddNewCategory = () => {
    setOpenPopup(true);
  };
  const handleEditCategory = (categoryId) => {
    setSelectedCategory(categoryId);
    setOpenPopupEdit(true);
  };
  const closePopup = () => {
    setOpenPopup(false);
    setOpenPopupEdit(false);
  };
  const fetchCategoryList = async () => {
    try {
      const actionResult = await CategoryService.getAll();
      if (actionResult.data) {
        setCategoryList(actionResult.data.category);
      }
    } catch (error) {
      console.log("Failed to fetch category list: ", error);
    }
  };
  useEffect(() => {
    fetchCategoryList();
  }, []);
  return (
    <Container maxWidth="xl">
      <Stack direction="row" justifyContent="flex-end" spacing={2} p={2}>
        <Button
          color="warning"
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOnclickAddNewCategory()}
        >
          Thêm danh mục mới
        </Button>
      </Stack>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 200 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Tên danh mục</StyledTableCell>
              <StyledTableCell align="right">Mô tả</StyledTableCell>
              <StyledTableCell align="right">Hành động</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categoryList?.map((row) => (
              <StyledTableRow key={row.id}>
                <StyledTableCell component="th" scope="row">
                  {row.name}
                </StyledTableCell>
                <StyledTableCell align="right">
                  {row.description}
                </StyledTableCell>
                <StyledTableCell align="right">
                  <Box component="div" sx={{ display: "inline", p: 1, m: 1 }}>
                    <Tooltip title="Chỉnh sửa" arrow>
                      <IconButton
                        color="warning"
                        size="small"
                        onClick={() => handleEditCategory(row.id)}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  <Box component="div" sx={{ display: "inline", p: 1, m: 1 }}>
                    <Tooltip title="Xem chi tiet" arrow>
                      <IconButton
                        color="warning"
                        size="small"
                        onClick={() => handleOnClickDetailCategory(row.id)}
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <DiaLog
        title="Thêm danh mục"
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
      >
        <AddCategory closePopup={closePopup} />
      </DiaLog>
      <DiaLog
        title="Chỉnh sửa danh mục"
        openPopup={openPopupEdit}
        setOpenPopup={setOpenPopupEdit}
      >
        <EditCategory
          closePopup={closePopup}
          selectedCategory={selectedCategory}
        />
      </DiaLog>
    </Container>
  );
}
