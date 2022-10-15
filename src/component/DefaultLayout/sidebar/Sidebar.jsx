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
import PeopleIcon from '@mui/icons-material/People';
import { useNavigate } from "react-router-dom";
import GroupAddIcon from '@mui/icons-material/GroupAdd';
const Sidebar = () => {
  const navigate = useNavigate();
  function handleChangeCategory() {
    navigate("/category");
  }
  function handleChangeManufacturer() {
    navigate("/manufacturer");
  }
  function handleChangeWarehouse(){
    navigate("/warehouseList")
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
            <span>Trang chủ</span>
          </li>
          <p className="title">Quản lý kho hàng</p>
          <li>
            <ProductionQuantityLimitsIcon className="icon" />
            <span>Sản phẩm</span>
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
            <span>Tạo phiếu nhập hàng</span>
          </li>
          <li>
            <ListIcon className="icon" />
            <span>Danh sách nhập hàng</span>
          </li>
          <p className="title">Quản lý xuất hàng</p>
          <li>
            <OutputIcon className="icon" />
            <span>Tạo phiếu xuất hàng</span>
          </li>
          <li>
            <ListIcon className="icon" />
            <span>Danh sách xuất hàng</span>
          </li>
          <li>
            <KeyboardReturnIcon className="icon" />
            <span>Danh sách trả hàng</span>
          </li>
          <p className="title">Trả hàng Lưu kho</p>
          <li>
            <InventoryIcon className="icon" />
            <span>Tạo phiếu lưu kho</span>
          </li>
          <li>
            <ListIcon className="icon" />
            <span>Danh sách lưu kho</span>
          </li>
          <p className="title">Kiểm kho</p>
          <li>
            <InventoryIcon className="icon" />
            <span>Tạo phiếu kiểm kho</span>
          </li>
          <li>
            <ListIcon className="icon" />
            <span>Lịch sử kiểm kho</span>
          </li>
          <p className="title">Nhân viên</p>
          <li>
            <GroupAddIcon className="icon" />
            <span>Đăng ký nhân viên mới</span>
          </li>
          <li>
            <PeopleIcon className="icon" />
            <span>Danh sách nhân viên</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
