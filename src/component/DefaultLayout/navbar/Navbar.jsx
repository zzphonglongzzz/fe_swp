import "./navbar.scss";
import AuthService from "../../../service/AuthService";
import React, { useEffect, useState } from "react";
import {
  AppBar,
  styled,
  Toolbar,
  Typography,
  Box,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  Stack,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowBackIosNew, Warehouse } from "@mui/icons-material";
import Label from "../../common/Label";
import StaffService from "../../../service/StaffService";

const titles = [
  { url: '/dashboard', title: 'Hệ thống quản lý kho vật tư nông nghiệp', backUrl: '' },
  { url: '/product', title: 'Danh sách sản phẩm', backUrl: null },
  { url: '/product/detail', title: 'Thông tin sản phẩm', backUrl: '/product' },
  { url: '/product/add', title: 'Thêm mới sản phẩm', backUrl: null },
  { url: '/product/edit', title: 'Sửa sản phẩm', backUrl: null },
  { url: '/category', title: 'Danh sách danh mục', backUrl: null },
  { url: '/category/detail', title: 'Thông tin danh mục', backUrl: '/category' },
  { url: '/category/add', title: 'Thêm mới danh mục', backUrl: '/category' },
  { url: '/category/edit', title: 'Sửa danh mục', backUrl: null },
  { url: '/manufacturer', title: 'Danh sách nhà sản xuất', backUrl: null },
  {
    url: '/manufacturer/detail',
    title: 'Chi tiết nhà sản xuất',
    backUrl: '/manufacturer',
  },
  { url: '/manufacturer/add', title: 'Thêm mới nhà sản xuất', backUrl: null },
  { url: '/manufacturer/edit', title: 'Chỉnh sửa thông tin nhà sản xuất', backUrl: null },
  { url: '/import/list', title: 'Danh sách phiếu nhập kho', backUrl: null },
  { url: '/import/detail', title: 'Thông tin phiếu nhập hàng', backUrl: '/import/list' },
  { url: '/import/create-order', title: 'Nhập kho', backUrl: null },
  { url: '/import/edit', title: 'Thông tin phiếu nhập hàng', backUrl: null },
  { url: '/export/list', title: 'Danh sách phiếu xuất hàng', backUrl: null },
  { url: '/export/detail', title: 'Thông tin phiếu xuất hàng', backUrl: '/export/list' },
  { url: '/export/create-order', title: 'Xuất kho', backUrl: null },
  { url: '/export/edit', title: 'Thông tin phiếu xuất hàng', backUrl: null },
  { url: '/export/return', title: 'Trả hàng', backUrl: null },
  { url: '/export/return/list', title: 'Phiếu trả hàng', backUrl: null },
  { url: '/export/return/detail', title: 'Thông tin phiếu trả hàng', backUrl: null },
  { url: '/export/cancel', title: 'Phiếu hủy xuất hàng', backUrl: null },
  { url: '/inventory-checking/create', title: 'Kiểm kho', backUrl: '' },
  { url: '/inventory-checking/list', title: 'Lịch sử kiểm kho', backUrl: null },
  { url: '/inventory-checking/detail', title: 'Chi tiết kiểm kho', backUrl: null },
  { url: '/staff/list', title: 'Danh sách nhân viên', backUrl: null },
  { url: '/staff/detail', title: 'Thông tin nhân viên', backUrl: null },
  { url: '/staff/add', title: 'Đăng ký nhân viên mới', backUrl: '' },
  { url: '/warehouse', title: 'Quản lý nhà kho', backUrl: null },
  { url: '/profile', title: 'Hồ sơ cá nhân', backUrl: null },
  { url: '/reset-password', title: 'Đổi mật khẩu', backUrl: null },
  { url: '/profile/edit', title: 'Thay đổi hồ sơ cá nhân', backUrl: null },
];
const StyledToolbar = styled(Toolbar)({
  display: "flex",
  justifyContent: "space-between",
});

const Icons = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: "20px",
  alignItems: "center",
}));

const UserBox = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: "10px",
  alignItems: "center",
  cursor: "pointer",
}));

const getRoleLabel = (exportOrderStatus) => {
  const map = {
    ROLE_USER: {
      text: "Thủ kho",
      color: "warning",
      fontSize: "12px",
      padding: "2px 4px",
    },
    ROLE_ADMIN: {
      text: "Chủ cửa hàng",
      color: "error",
      fontSize: "12px",
      padding: "2px 4px",
    },
  };

  const { text, color, fontSize, padding } = map[exportOrderStatus];

  return (
    <Label padding={padding} fontSize={fontSize} color={color}>
      {text}
    </Label>
  );
};
const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [fullname, setFullname] = useState("");
  const [backUrl, setBackUrl] = useState(null);
  //const [image, setImage] = useState();
  const [role, setRole] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const user = AuthService.getCurrentUser();

  const logOut = () => {
    AuthService.logout();
    navigate("/login");
  };
  const fetchStaffDetail = async () => {
    try {
      const dataResult = await StaffService.getProfile();
      console.log("dataResult", dataResult);
      if (dataResult) {
        setFullname(dataResult.data.fullName);
      }
    } catch (error) {
      console.log("Failed to fetch staff detail: ", error);
    }
  };
  useEffect(() => {
    fetchStaffDetail()
    titles.forEach((item) => {
      if (location.pathname.includes(item.url)) {
        setTitle(item.title);
        setBackUrl(item.backUrl);
      }
    });
    //setFullname(user.username);
    setRole(user.roles[0]);
  }, [location.pathname]);
  return (    
    <AppBar sx={{ backgroundColor: "white", color: "black" }} position="sticky">
      <StyledToolbar>
        <Typography
          variant="h6"
          sx={{ display: { xs: 'none', sm: 'block' } }}
        >
          {backUrl !== '' && (
            <IconButton
              variant="text"
              color="inherit"
              onClick={() => navigate(!backUrl ? -1 : backUrl)}
            >
              <ArrowBackIosNew />
            </IconButton>
          )}
          {title}
        </Typography>
        <Warehouse sx={{ display: { xs: "block", sm: "none" } }} />
        <Icons>
          <UserBox onClick={(e) => setOpen(true)}>
            <Stack alignItems="flex-end">
              <Typography variant="h5">{fullname}</Typography>
              {role && getRoleLabel(role)}
            </Stack>
            <Avatar
              sx={{ width: 45, height: 45 }}
              // src={user.image ? user.image : require('/')}
              accept="image/*"
            />
          </UserBox>
        </Icons>
      </StyledToolbar>
      <Menu
        id="basic-menu"
        open={open}
        onClose={(e) => setOpen(false)}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        sx={{ marginTop: "38px" }}
      >
        <MenuItem onClick={() => navigate("/profile")}>Hồ sơ cá nhân</MenuItem>
        <MenuItem onClick={logOut}>Đăng xuất</MenuItem>
      </Menu>
    </AppBar>
  );
};

export default Navbar;
