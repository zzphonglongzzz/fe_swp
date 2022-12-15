
import React, { useState,useEffect } from "react";
import DashboardService from "../../service/DashboardService";
import "./widget.scss";

const Widget = ({ type }) => {
  const [totalProduct,setTotalProduct] = useState();
  const [totalImportOrders, settotalImportOrders] = useState();
  const [totalExports,setTotalExports] = useState();
  let data;

  const productInWarehouse = async () => {
    try {
      const actionResult = await DashboardService.getTotalProductInWarehouse();
      if (actionResult.data) {
        setTotalProduct(actionResult.data);
      }
    } catch (error) {
      console.log("Failed to fetch category list: ", error);
    }
 };
 const quantityImportOrders = async () => {
  try {
    const actionResult = await DashboardService.getTotalImportOrders();
    if (actionResult.data) {
      settotalImportOrders(actionResult.data);
    }
  } catch (error) {
    console.log("Failed to fetch category list: ", error);
  }
};
const quantityExportOrders = async () => {
  try {
    const actionResult = await DashboardService.getTotalExportOrders();
    if (actionResult.data) {
      setTotalExports(actionResult.data);
    }
  } catch (error) {
    console.log("Failed to fetch category list: ", error);
  }
};
 useEffect(() => {
  productInWarehouse();
  quantityImportOrders();
  quantityExportOrders();
}, []);

  switch (type) {
    case "user":
      data = {
        title: "Số mặt hàng đang có trong kho",
        isMoney: false,
        amount: totalProduct
      };
      break;
    case "order":
      data = {
        title: "Số đơn nhập đã nhập kho",
        isMoney: false,
        amount: totalImportOrders
      };
      break;
    case "earning":
      data = {
        title: "Số đơn xuất đã xuất hàng",
        isMoney: true,
        amount: totalExports
      };
      break;
    default:
      break;
  }
  return (
    <div className="widget">
      <div className="left">
        <span className="title">{data.title}</span>
        <span className="counter">{data.amount}</span>
      </div>
    </div>
  );
};

export default Widget;
