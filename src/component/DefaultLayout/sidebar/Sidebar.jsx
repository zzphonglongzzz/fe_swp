import "./sidebar.scss";
import DashboardIcon from "@mui/icons-material/Dashboard";
import StoreMallDirectoryIcon from "@mui/icons-material/StoreMallDirectory";
import GradingOutlinedIcon from "@mui/icons-material/GradingOutlined";
import ProductionQuantityLimitsIcon from "@mui/icons-material/ProductionQuantityLimits";
import WarehouseIcon from "@mui/icons-material/Warehouse";
import InputIcon from "@mui/icons-material/Input";
import OutputIcon from "@mui/icons-material/Output";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import InventoryIcon from "@mui/icons-material/Inventory";
import ListIcon from "@mui/icons-material/List";
import PeopleIcon from "@mui/icons-material/People";
import { useNavigate } from "react-router-dom";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import AuthService from "../../../service/AuthService";

const Sidebar = () => {
  const navigate = useNavigate();
  const currentUserRole = AuthService.getCurrentUser().roles[0];
  console.log(currentUserRole);
  function handleDashboard() {
    navigate("/dashboard");
  }
  function handleChangeCategory() {
    navigate("/category");
  }
  function handleChangeManufacturer() {
    navigate("/manufacturer");
  }
  function handleChangeWarehouse() {
    navigate("/warehouseList");
  }
  function handleChangeProduct() {
    navigate("/product");
  }
  function handleCreateInport() {
    navigate("/import/create-order");
  }
  function handleImportList() {
    navigate("/import/list");
  }
  function handleExportList() {
    navigate("/export/list");
  }
  function hanleCreateExport() {
    navigate("/export/create-order");
  }
  function handleClickListReturn() {
    navigate("/export/return/list");
  }
  function handleClickListInventoryChecking() {
    navigate("/inventory-checking/list");
  }
  function handleClickCreateInventoryChecking() {
    navigate("/inventory-checking/create");
  }
  function handleClickStaffList() {
    navigate("/staff/list");
  }
  function handleCreateStaff() {
    navigate("/staff/add");
  }
  return (
    <div className="sidebar">
      <div className="top">
        <span className="logo">CAMMS</span>
      </div>
      <hr />
      <div className="center">
        <ul>
          <li>
            <DashboardIcon className="icon" />
            <span onClick={handleDashboard}>Trang ch???</span>
          </li>
          <p className="title">Qu???n l?? kho h??ng</p>
          <li>
            <ProductionQuantityLimitsIcon className="icon" />
            <span onClick={handleChangeProduct}>S???n ph???m</span>
          </li>
          <li>
            <StoreMallDirectoryIcon className="icon" />
            <span onClick={handleChangeCategory}>Danh m???c</span>
          </li>
          <li>
            <GradingOutlinedIcon className="icon" />
            <span onClick={handleChangeManufacturer}>Nh?? s???n xu???t</span>
          </li>
          <li>
            <WarehouseIcon className="icon" />
            <span onClick={handleChangeWarehouse}>Nh?? kho</span>
          </li>
          <p className="title">Qu???n l?? nh???p h??ng</p>
          <li>
            <InputIcon className="icon" />
            <span onClick={handleCreateInport}>T???o phi???u nh???p h??ng</span>
          </li>
          <li>
            <ListIcon className="icon" />
            <span onClick={handleImportList}>Danh s??ch nh???p h??ng</span>
          </li>
          <p className="title">Qu???n l?? xu???t h??ng</p>
          <li>
            <OutputIcon className="icon" />
            <span onClick={hanleCreateExport}>T???o phi???u xu???t h??ng</span>
          </li>
          <li>
            <ListIcon className="icon" />
            <span onClick={handleExportList}>Danh s??ch xu???t h??ng</span>
          </li>
          <li>
            <KeyboardReturnIcon className="icon" />
            <span onClick={handleClickListReturn}>Danh s??ch tr??? h??ng</span>
          </li>
          {currentUserRole === "ROLE_ADMIN" && (
            <>
              <p className="title">Ki???m kho</p>
              <li>
                <InventoryIcon className="icon" />
                <span onClick={handleClickCreateInventoryChecking}>
                  T???o phi???u ki???m kho
                </span>
              </li>
              <li>
                <ListIcon className="icon" />
                <span onClick={handleClickListInventoryChecking}>
                  L???ch s??? ki???m kho
                </span>
              </li>

              <p className="title">Nh??n vi??n</p>
              <li>
                <GroupAddIcon className="icon" />
                <span onClick={handleCreateStaff}>????ng k?? nh??n vi??n m???i</span>
              </li>
              <li>
                <PeopleIcon className="icon" />
                <span onClick={handleClickStaffList}>Danh s??ch nh??n vi??n</span>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
