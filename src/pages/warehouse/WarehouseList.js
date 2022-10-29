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
import { Container } from "@mui/system";
import DiaLog from "../../component/common/dialog/index";
import AddIcon from "@mui/icons-material/Add";
import WarehouseService from "../../service/WarehouseService";
import { Stack, Tooltip, IconButton } from "@mui/material";
import { Edit } from "@mui/icons-material";
import AddWarehouse from "./AddWarehouse";
import EditWarehouse from "./EditWarehouse";

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
const WarehouseList = () => {
  const [openPopup, setOpenPopup] = useState(false);
  const [openPopupEdit, setOpenPopupEdit] = useState(false);
  const [warehouseList, setWarehouseList] = useState();
  const [selectedWarehouse, setSelectedWarehouse] = useState();

  const handleOnclickAddNewWareHouse = (wareHouseId) => {
    setSelectedWarehouse(wareHouseId);
    setOpenPopup(true);
  };
  const handleOnClickEdit = (warehouseId) => {
    setSelectedWarehouse(warehouseId);
    setOpenPopupEdit(true);
  };
  const closePopup = () => {
    setOpenPopup(false);
    setOpenPopupEdit(false);
  };
  const getAllWarehouse = async () => {
    try {
      const actionResult = await WarehouseService.getlistWarehouse();
      if (actionResult.data) {
        setWarehouseList(actionResult.data.warehouses);
      }
    } catch (error) {
      console.log("Failed to fetch category list: ", error);
    }
  };
  useEffect(() => {
    getAllWarehouse();
  }, []);
  return (
    <Container>
      <Stack direction="row" justifyContent="flex-end" spacing={2} p={2}>
        {/* <Button
          color="warning"
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOnclickAddNewWareHouse()}
        >
          Thêm mới nhà kho
        </Button> */}
      </Stack>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 200 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Tên nhà kho</StyledTableCell>
              <StyledTableCell align="right">Địa chỉ</StyledTableCell>
              <StyledTableCell align="right">Hành động</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {warehouseList?.map((row) => (
              <StyledTableRow key={row.id}>
                <StyledTableCell component="th" scope="row">
                  {row.name}
                </StyledTableCell>
                <StyledTableCell align="right">
                  {row.address}
                </StyledTableCell>
                <StyledTableCell align="right">
                  <Tooltip title="Chỉnh sửa" arrow>
                    <IconButton
                      color="warning"
                      size="small"
                      onClick={() => handleOnClickEdit(row.id)}
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
      <DiaLog
        title="Thêm nhà kho"
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
      >
        <AddWarehouse closePopup={closePopup} />
      </DiaLog>
      <DiaLog
        title="Chỉnh sửa thông tin nhà kho"
        openPopup={openPopupEdit}
        setOpenPopup={setOpenPopupEdit}
      >
        <EditWarehouse
          closePopup={closePopup}
          selectedWarehouse={selectedWarehouse}
        />
      </DiaLog>
    </Container>
  );
};

export default WarehouseList;
