import "./DefaultLayout.scss";
import Sidebar from "../../component/DefaultLayout/sidebar/Sidebar";
import Navbar from "../../component/DefaultLayout/navbar/Navbar";
import {Box} from "@mui/material";

function DefaultLayout({ children }) {
  return (
    <div className="home">
      <Sidebar />
      <div className="homeContainer">
        <Navbar />
        <Box height={20} />
        <Box sx={{ backgroundColor: "#fbfbfb", minHeight: "94vh" }} p={2}>
          {children}
        </Box>
      </div>
    </div>
  );
}

export default DefaultLayout;
