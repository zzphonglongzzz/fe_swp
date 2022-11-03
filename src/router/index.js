import CategoryDetail from "../pages/category/CategoryDetail";
import CategoryList from "../pages/category/CategoryList";
import CommonForgotPass from "../pages/forgotPassword/CommonForgotPassword";
import Home from "../pages/home/Home";
import ImportGoods from "../pages/import/importGood";
import ImportList from "../pages/import/importList";
import Login from "../pages/login/Login";
import AddEditManufacturer from "../pages/manufacturer/AddEditManufacturer";
import ManufacturerDetail from "../pages/manufacturer/ManufacturerDetail";
import ManufacturerList from "../pages/manufacturer/ManufacturerList";

import AddEditProduct from "../pages/product/AddEditProduct";
import ProductDetail from "../pages/product/ProductDetail";
import ProductList from "../pages/product/ProductList";
import WarehouseList from "../pages/warehouse/WarehouseList";

const publicRoutes = [
  //public route
  { path: "/", component: Login, layout: null },
  { path: "/login", component: Login, layout: null },
  { path: "/forgotPassword", component: CommonForgotPass, layout: null },
];
const privateRoutes = [
  { path: "/category", component: CategoryList },
  { path: "/category/subCategory/:categoryId", component: CategoryDetail },

  //manufacturer
  { path: "/manufacturer", component: ManufacturerList },
  {
    path: "/manufacturer/detail/:manufacturerId",
    component: ManufacturerDetail,
  },
  { path: "/manufacturer/add", component: AddEditManufacturer },
  {
    path: "/manufacturer/edit/:manufacturerId",
    component: AddEditManufacturer,
  },
  //warehouse
  {
    path: "/warehouseList",
    component: WarehouseList,
  },
  //product
  {
    path: "/product",
    component: ProductList,
  },
  {
    path: "/product/detail/:productId",
    component: ProductDetail,
  },
  {
    path: "/product/add",
    component: AddEditProduct,
  },
  {
    path: "/product/edit/:productId",
    component: AddEditProduct,
  },
  //importOrder
  { path: "/import/create-order", component: ImportGoods },
  { path: "/import/list", component: ImportList },
  { path: "/dashboard", component: Home },
];
export { publicRoutes, privateRoutes };
