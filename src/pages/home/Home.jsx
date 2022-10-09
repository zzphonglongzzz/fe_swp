import "./home.scss";
import Widget from "../../component/widget/widget";
import Featured from "../../component/featured/Featured";
import Chart from "../../component/chart/Chart";
import Tables from "../../component/table/Tables";
import {Box} from "@mui/material";

const Home = () => {
  return (
    <Box>
      <div className="widgets">
        <Widget type="user" />
        <Widget type="order" />
        <Widget type="earning" />
        <Widget type="balance" />
      </div>
      <div className="charts">
        <Featured />
        <Chart />
      </div>
      <div className="listContainer">
        <div className="listTitle">Lastest Transactions</div>
        <Tables />
      </div>
    </Box>
  );
};

export default Home;
