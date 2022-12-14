import "./home.scss";
import Widget from "../../component/widget/widget";
import Featured from "../../component/featured/Featured"
import Chart from "../../component/chart/Chart"
import {Box} from "@mui/material";

const Home = () => {
  return (
    <Box>
      <div className="widgets">
        <Widget type="user" />
        <Widget type="order" />
        <Widget type="earning" />
      </div>
      <div className="charts">
        <Featured/>
        <Chart/>
      </div>
    </Box>
  );
};

export default Home;
