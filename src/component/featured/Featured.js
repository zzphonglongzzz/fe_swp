import React from "react";
import ReactApexChart from "react-apexcharts";
import { useState,useEffect } from "react";
import DashboardService from "../../service/DashboardService";

const Featured = () => {
  const [product,setProduct] = useState([]);

  const getProductInStock = async () => {
    try {
      const actionResult = await DashboardService.getProuctInStock();
      if (actionResult.data) {
        setProduct(actionResult.data.listProductInStock);
      
      }
    } catch (error) {
      console.log("Failed to fetch category list: ", error);
    }
  };
  useEffect(() => {
    getProductInStock();
  }, []);
  const labels = product.map(a => a.productCode);
  const series  = product.map(b => b.totalSales)
  const data = {
    series: series,
    options: {
      chart: {
        width: 380,
        type: "pie",
      },
      labels: labels,
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
    },
  };
  return (
    <div id="chart">
      Hàng mặt hàng sắp hết hạn
      <ReactApexChart
        options={data.options}
        series={data.series}
        type="pie"
        width={500}
        height={500}
      />
    </div>
  );
};

export default Featured;
