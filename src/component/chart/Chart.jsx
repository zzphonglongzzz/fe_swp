import React, { useState,useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import DashboardService from "../../service/DashboardService";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  indexAxis: "y",
  elements: {
    bar: {
      borderWidth: 2,
    },
  },
  responsive: false,
  plugins: {
    legend: {
      position: "center",
    },
    title: {
      display: true,
      text: "Sản phẩm bán chạy",
    },
  },
};

const Chart = () => {
  const [product,setProduct] = useState([]);

  const getTopSaleProduct = async () => {
    try {
      const actionResult = await DashboardService.getProuctSale();
      if (actionResult.data) {
        setProduct(actionResult.data.listTop5);
      
      }
    } catch (error) {
      console.log("Failed to fetch category list: ", error);
    }
  };
  const labels = product.map(a => a.productCode);
  const total  = product.map(b => b.totalSales)
  const data = {
  labels,
  datasets: [
    {
      label: "Số lượng",
      data: total,
      borderColor: "rgb(255, 99, 132)",
      backgroundColor: "rgba(255, 99, 132, 0.5)",
    },
  ],
};
  useEffect(() => {
    getTopSaleProduct();
  }, []);
  return <Bar width={500} height={500} options={options} data={data} />;
};
export default Chart;
