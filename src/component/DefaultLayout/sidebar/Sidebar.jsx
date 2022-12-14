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
            <span onClick={handleDashboard}>Trang chủ</span>
          </li>
          <p className="title">Quản lý kho hàng</p>
          <li>
            <ProductionQuantityLimitsIcon className="icon" />
            <span onClick={handleChangeProduct}>Sản phẩm</span>
          </li>
          <li>
            <StoreMallDirectoryIcon className="icon" />
            <span onClick={handleChangeCategory}>Danh mục</span>
          </li>
          <li>
            <GradingOutlinedIcon className="icon" />
            <span onClick={handleChangeManufacturer}>Nhà sản xuất</span>
          </li>
          <li>
            <WarehouseIcon className="icon" />
            <span onClick={handleChangeWarehouse}>Nhà kho</span>
          </li>
          <p className="title">Quản lý nhập hàng</p>
          <li>
            <InputIcon className="icon" />
            <span onClick={handleCreateInport}>Tạo phiếu nhập hàng</span>
          </li>
          <li>
            <ListIcon className="icon" />
            <span onClick={handleImportList}>Danh sách nhập hàng</span>
          </li>
          <p className="title">Quản lý xuất hàng</p>
          <li>
            <OutputIcon className="icon" />
            <span onClick={hanleCreateExport}>Tạo phiếu xuất hàng</span>
          </li>
          <li>
            <ListIcon className="icon" />
            <span onClick={handleExportList}>Danh sách xuất hàng</span>
          </li>
          <li>
            <KeyboardReturnIcon className="icon" />
            <span onClick={handleClickListReturn}>Danh sách trả hàng</span>
          </li>
          {currentUserRole === "ROLE_ADMIN" && (
            <>
              <p className="title">Kiểm kho</p>
              <li>
                <InventoryIcon className="icon" />
                <span onClick={handleClickCreateInventoryChecking}>
                  Tạo phiếu kiểm kho
                </span>
              </li>
              <li>
                <ListIcon className="icon" />
                <span onClick={handleClickListInventoryChecking}>
                  Lịch sử kiểm kho
                </span>
              </li>

              <p className="title">Nhân viên</p>
              <li>
                <GroupAddIcon className="icon" />
                <span onClick={handleCreateStaff}>Đăng ký nhân viên mới</span>
              </li>
              <li>
                <PeopleIcon className="icon" />
                <span onClick={handleClickStaffList}>Danh sách nhân viên</span>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
