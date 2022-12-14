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
import AccessDenied from "../component/DefaultLayout/AccessDenied/AccessDenied";

const publicRoutes = [
  //public route
  { path: "/", component: Login, layout: null },
  { path: "/login", component: Login, layout: null },
  { path: "/forgotPassword", component: CommonForgotPass, layout: null },
];
const privateRoutes = [
  { path: "/category", component: CategoryList, acceptRole: ["ROLE_ADMIN","ROLE_USER"]},
  { path: "/category/subCategory/:categoryId", component: CategoryDetail, acceptRole: ["ROLE_ADMIN","ROLE_USER"]},

  //manufacturer
  { path: "/manufacturer", component: ManufacturerList,acceptRole: ["ROLE_ADMIN","ROLE_USER"] },
  {
    path: "/manufacturer/detail/:manufacturerId",
    component: ManufacturerDetail,
    acceptRole: ["ROLE_ADMIN","ROLE_USER"]
  },
  { path: "/manufacturer/add", component: AddEditManufacturer,acceptRole: ["ROLE_ADMIN","ROLE_USER"] },
  {
    path: "/manufacturer/edit/:manufacturerId",
    component: AddEditManufacturer,
    acceptRole: ["ROLE_ADMIN","ROLE_USER"]
  },
  //warehouse
  {
    path: "/warehouseList",
    component: WarehouseList,
    acceptRole: ["ROLE_ADMIN","ROLE_USER"]
  },
  //product
  {
    path: "/product",
    component: ProductList,
    acceptRole: ["ROLE_ADMIN","ROLE_USER"]
  },
  {
    path: "/product/detail/:productId",
    component: ProductDetail,
    acceptRole: ["ROLE_ADMIN","ROLE_USER"]
  },
  {
    path: "/product/add",
    component: AddEditProduct,
    acceptRole: ["ROLE_ADMIN","ROLE_USER"]
  },
  {
    path: "/product/edit/:productId",
    component: AddEditProduct,
    acceptRole: ["ROLE_ADMIN","ROLE_USER"]
  },
  //importOrder
  { path: "/import/create-order", component: ImportGoods ,acceptRole: ["ROLE_ADMIN","ROLE_USER"]},
  { path: "/import/list", component: ImportList,acceptRole: ["ROLE_ADMIN","ROLE_USER"] },
  { path: "/import/detail/:importOrderId", component: ImportOrderDetail,acceptRole: ["ROLE_ADMIN","ROLE_USER"] },
  { path: "/import/edit/:importOrderId", component: updateImportOrder,acceptRole: ["ROLE_ADMIN","ROLE_USER"] },
  //exportOrder
  { path: "/export/create-order", component: ExportGood,acceptRole: ["ROLE_ADMIN","ROLE_USER"]},
  { path: "/export/list", component: ExportList,acceptRole: ["ROLE_ADMIN","ROLE_USER"] },
  { path: "/export/detail/:exportOrderId", component: ExportOrderDetail,acceptRole: ["ROLE_ADMIN","ROLE_USER"] },
  { path: "/export/edit/:exportOrderId", component: UpdateExportOrderDetail,acceptRole: ["ROLE_ADMIN","ROLE_USER"]},
  { path: "/export/return/:exportOrderId", component: ReturnGoods,acceptRole: ["ROLE_ADMIN","ROLE_USER"] },
  { path: "/export/return/list", component: ReturnList,acceptRole: ["ROLE_ADMIN","ROLE_USER"] },
  {
    path: "/export/return/detail/:returnOrderId",
    component: ReturnOrderDetail,
    acceptRole: ["ROLE_ADMIN","ROLE_USER"]
  },
  { path: "/export/cancel/:exportOrderId", component: AddExportOrderCancel,acceptRole: ["ROLE_USER"] },
  { path: "/export/cancel/detail/:exportOrderId", component: ExportOrderCancelDetail,acceptRole: ["ROLE_ADMIN"] },

  // inventoryChecking route
  { path: "/inventory-checking/list", component: InventoryCheckingList,acceptRole: ["ROLE_ADMIN"] },
  {
    path: "/inventory-checking/detail/:inventoryCheckingId",
    component: InventoryCheckingDetail,
    acceptRole: ["ROLE_ADMIN"]
  },
  { path: "/inventory-checking/create", component: CreateInventoryChecking,acceptRole: ["ROLE_ADMIN"] },

  { path: "/profile", component: Profile,acceptRole: ["ROLE_ADMIN","ROLE_USER"] },
  { path: "/profile/edit", component: UpdateProfile,acceptRole: ["ROLE_ADMIN","ROLE_USER"] },
  

  //dashboard
  { path: "/dashboard", component: Home,acceptRole: ["ROLE_ADMIN","ROLE_USER"] },
  { path: "*", component: NotFound, layout: null },
  { path: '/reset-password', component: ResetPassword,acceptRole: ["ROLE_ADMIN","ROLE_USER"]},
  { path: '/denied', component: AccessDenied, layout: null, acceptRole: ["ROLE_ADMIN","ROLE_USER"]},

  //staff
  { path: '/staff/list', component: StaffList,acceptRole: ["ROLE_ADMIN"] },
  { path: '/staff/add', component: AddEditStaff,acceptRole: ["ROLE_ADMIN"]},
  { path: '/staff/detail/:staffId', component: AddEditStaff,acceptRole: ["ROLE_ADMIN"]},
];
export { publicRoutes, privateRoutes };
