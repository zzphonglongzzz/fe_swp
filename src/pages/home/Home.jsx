import "./home.scss";
import Widget from "../../component/widget/Widget";
import Featured from "../../component/featured/Featured";
import Chart from "../../component/chart/Chart";
import { Box, Grid, Container } from "@mui/material";

const Home = () => {
  // const [product, setProduct] = useState([]);

  // const getTopSaleProduct = async () => {
  //   try {
  //     const actionResult = await DashboardService.getProuctSale();
  //     if (actionResult.data) {
  //       console.log(actionResult.data.listTop5);
  //       setProduct(actionResult.data.listTop5);
  //       //setQuantity(actionResult.data.listTop5);
  //     }
  //   } catch (error) {
  //     console.log("Failed to fetch category list: ", error);
  //   }
  // };
  // useEffect(() => {
  //   getTopSaleProduct();
  // }, []);
  return (
    <Box>
      <Container maxWidth="xl">
        <div className="widgets">
          <Widget type="user" />
          <Widget type="order" />
          <Widget type="earning" />
        </div>
        <Grid container spacing={2}>
          <Grid xs={5} item textAlign="center">
            <Featured />
          </Grid>
          <Grid xs={7} item>
            <Chart/>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Home;
