import CategoryDetail from "../pages/category/CategoryDetail";
import CategoryList from "../pages/category/CategoryList";
import CommonForgotPass from "../pages/forgotPassword/CommonForgotPassword";
import Home from "../pages/home/Home";
import Login from "../pages/login/Login";
import AddEditManufacturer from "../pages/manufacturer/AddEditManufacturer";
import ManufacturerDetail from "../pages/manufacturer/ManufacturerDetail";
import ManufacturerTable from "../pages/manufacturer/ManufacturerTable";
import WarehouseList from "../pages/warehouse/WarehouseList"

const publiRoutes = [
  //public route
  { path: "/", component: Home },
  { path: "/home", component: Home },
  { path: "/login", component: Login, layout: null },
  { path: "/forgotPassword", component: CommonForgotPass, layout: null },
  //category
  { path: "/category", component: CategoryList },
  { path: "/category/detail/:categoryId", component: CategoryDetail },
  //{ path: "/subcategory/add",component:AddEditSubCategory},
  //{ path: "/subcategory/update/:subCategoryId",component:AddEditSubCategory},
  //manufacturer
  { path: "/manufacturer", component: ManufacturerTable },
  {
    path: "/manufacturer/detail/:manufacturerId",
    component: ManufacturerDetail,
  },
  { path: "/manufacturer/add", component: AddEditManufacturer },
  {
    path: "/manufacturer/edit/:manufacturerId",
    component: AddEditManufacturer,
  },
  {
    path:"/warehouseList",component:WarehouseList
  }
];
export default publiRoutes;
