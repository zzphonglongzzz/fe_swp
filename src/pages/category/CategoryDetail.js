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
import { useNavigate, useParams } from "react-router-dom";
import {
  Card,
  Grid,
  Stack,
  Typography,
  Tooltip,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { Edit } from "@mui/icons-material";
import Dialog from "../../component/common/dialog/index";
import "./CategoryDetail.scss";
import EditSubCategory from "./EditSubCategory";
import AddSubCategory from "./AddSubCategory";

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
const CategoryDetail = () => {
  const { categoryId } = useParams();
  const [category,setCategory] =useState();
  const [subCategoryList, setSubCategoryList] = useState([]);
  const [openPopup, setOpenPopup] = useState(false);
  const [editSubCategory, setSubEditCategory] = useState();
  const [openPopupEdit, setOpenPopupEdit] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState();
  const navigate= useNavigate();

  const handleOnClickAddNewSubCategory = (categoryId) => {
    setSelectedCategory(categoryId);
    setOpenPopup(true);
  };

  const handleOnClickEditSubCategory = (Category) => {
    setSubEditCategory(Category);
    setOpenPopupEdit(true);
  };

  const closePopup = () => {
    setOpenPopup(false);
    setOpenPopupEdit(false);
  };
  const getCategoryDetail = async () => {
    try {
      const params = {
        categoryId: categoryId
      };
      const actionResult = await CategoryService.getCategoryDetail(params);
      if (actionResult.data && actionResult.data != null) {
        setCategory(actionResult.data.category);
        setSubCategoryList(actionResult.data.subCategory);
      }else{
        navigate('/404')
      }
    } catch (error) {
      console.log("Failed to fetch category list: ", error);
    }
  };
  useEffect(() => {
    getCategoryDetail();
  }, []);
  return (
    <Grid>
      <Card className="cardHeader">
        <Stack>
          <Typography variant="h5" style={{ fontWeight: "bold" }}>
            {category?.name}
          </Typography>
        </Stack>
        <Button
          onClick={() => handleOnClickAddNewSubCategory(categoryId)}
          color="warning"
          variant="contained"
          startIcon={<AddIcon />}
        >
          Th??m m???i danh m???c ph???
        </Button>
      </Card>
      <Card>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 200 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>T??n danh m???c</StyledTableCell>
                <StyledTableCell align="right">M?? t???</StyledTableCell>
                <StyledTableCell align="right">H??nh ?????ng</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {subCategoryList?.map((row) => (
                <StyledTableRow key={row.id}>
                  <StyledTableCell component="th" scope="row">
                    {row.name}
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    {row.description}
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    <Tooltip title="Ch???nh s???a" arrow>
                      <IconButton
                        color="warning"
                        size="small"
                        onClick={() => handleOnClickEditSubCategory(row)}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
      <Dialog
        title="S???a danh m???c"
        openPopup={openPopupEdit}
        setOpenPopup={setOpenPopupEdit}
      >
        <EditSubCategory
          closePopup={closePopup}
          Subcategory={editSubCategory}
          categoryId={categoryId}
        />
      </Dialog>
      <Dialog
        title="Th??m danh m???c ph???"
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
      >
        <AddSubCategory
          closePopup={closePopup}
          selectedCategory={categoryId}
        />
      </Dialog>
    </Grid>
  );
};

export default CategoryDetail;
