import CategoryDetail from "../pages/category/CategoryDetail";
import CategoryList from "../pages/category/CategoryList";
import CommonForgotPass from "../pages/forgotPassword/CommonForgotPassword";
import Home from "../pages/home/Home";
import Login from "../pages/login/Login"
import ManufacturerDetail from "../pages/manufacturer/ManufacturerDetail";
import ManufacturerTable from "../pages/manufacturer/ManufacturerTable";

const publiRoutes =[
  { path: '/', component:Home},
  { path: '/home', component:Home},
  { path: '/category',component:CategoryList},
  { path: '/login',component:Login,layout:null},
  { path: '/forgotPassword',component:CommonForgotPass,layout:null},
  { path: '/category/detail/:categoryId', component:CategoryDetail},
  { path: '/manufacturer',component:ManufacturerTable},
  { path: '/manufacturer/detail/:manufacturerId',component:ManufacturerDetail} 
]
export default publiRoutes