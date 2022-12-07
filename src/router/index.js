import CategoryDetail from "../pages/category/CategoryDetail";
import CategoryList from "../pages/category/CategoryList";
import ExportGood from "../pages/export/ExportGood";
import CommonForgotPass from "../pages/forgotPassword/CommonForgotPassword";
import Home from "../pages/home/Home";
import ImportGoods from "../pages/import/importGood";
import ImportList from "../pages/import/importList";
import ImportOrderDetail from "../pages/import/ImportOrderDetail";
import updateImportOrder from "../pages/import/UpdateImportOrder";
import Login from "../pages/login/Login";
import AddEditManufacturer from "../pages/manufacturer/AddEditManufacturer";
import ManufacturerDetail from "../pages/manufacturer/ManufacturerDetail";
import ManufacturerList from "../pages/manufacturer/ManufacturerList";
import UpdateExportOrderDetail from "../pages/export/UpdateExportOrderDetail";
import AddEditProduct from "../pages/product/AddEditProduct";
import ProductDetail from "../pages/product/ProductDetail";
import ProductList from "../pages/product/ProductList";
import WarehouseList from "../pages/warehouse/WarehouseList";
import ExportOrderDetail from "../pages/export/ExportOrderDetail";
import ExportList from "../pages/export/ExportList";
import InventoryCheckingList from "../pages/Inventory Checking/InventoryCheckingList";
import InventoryCheckingDetail from "../pages/Inventory Checking/InventoryCheckingDetail";
import CreateInventoryChecking from "../pages/Inventory Checking/CreateInventoryChecking";
import Profile from "../pages/profile/Profile";
import UpdateProfile from "../pages/profile/UpdateProfile";
import NotFound from "../component/DefaultLayout/NotFound/NotFound";
import ReturnGoods from "../pages/return/ReturnGoods";
import ReturnList from "../pages/return/ReturnList";
import ReturnOrderDetail from "../pages/return/ReturnOrderDetail";
import ResetPassword from "../pages/profile/ResetPassword";
import AddExportOrderCancel from "../pages/export/AddExportOrderCancel";
import ExportOrderCancelDetail from "../pages/export/ExportOrderCancelDetail";
import StaffList from "../pages/staff/StaffList";
import AddEditStaff from "../pages/staff/AddEditStaff"

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
  { path: "/import/detail/:importOrderId", component: ImportOrderDetail },
  { path: "/import/edit/:importOrderId", component: updateImportOrder },
  //exportOrder
  { path: "/export/create-order", component: ExportGood },
  { path: "/export/list", component: ExportList },
  { path: "/export/detail/:exportOrderId", component: ExportOrderDetail },
  { path: "/export/edit/:exportOrderId", component: UpdateExportOrderDetail },
  { path: "/export/return/:exportOrderId", component: ReturnGoods },
  { path: "/export/return/list", component: ReturnList },
  {
    path: "/export/return/detail/:returnOrderId",
    component: ReturnOrderDetail,
  },
  { path: "/export/cancel/:exportOrderId", component: AddExportOrderCancel },
  { path: "/export/cancel/detail/:exportOrderId", component: ExportOrderCancelDetail },

  // inventoryChecking route
  { path: "/inventory-checking/list", component: InventoryCheckingList },
  {
    path: "/inventory-checking/detail/:inventoryCheckingId",
    component: InventoryCheckingDetail,
  },
  { path: "/inventory-checking/create", component: CreateInventoryChecking },

  { path: "/profile", component: Profile },
  { path: "/profile/edit", component: UpdateProfile },
  //dashboard
  { path: "/dashboard", component: Home },
  { path: "*", component: NotFound, layout: null },
  { path: '/reset-password', component: ResetPassword},

  //staff
  { path: '/staff/list', component: StaffList },
  { path: '/staff/add', component: AddEditStaff},
  { path: '/staff/detail/:staffId', component: AddEditStaff},
];
export { publicRoutes, privateRoutes };
