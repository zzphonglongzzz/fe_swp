import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Fragment, useEffect, useRef, useState } from "react";
import { Form, Formik } from "formik";
import FormatDataUtils from "../../utils/FormatDataUtils";
import * as Yup from "yup";
import ExportOrderService from "../../service/ExportOrderService";

const ReturnGoods = () => {
  const { exportOrderId } = useParams();
  const [productList, setProductList] = useState([]);
  const navigate = useNavigate();
  const [openPopup, setOpenPopup] = useState(false);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState();
  const [isConfirm, setIsConfirm] = useState(false);
  const valueFormik = useRef();
  const errorFormik = useRef();
  const [listConsignment,setListConsignment] = useState([]);

  const FORM_VALIDATION = Yup.object().shape({
    description: Yup.string().max(255, "Mô tả không thể dài quá 255 kí tự"),
  });
  

  const handleOnClickConfirm = () => {
    setTitle("Bạn có chắc chắn muốn xác nhận trả hàng không?");
    setMessage("");
    setErrorMessage(null);
    setIsConfirm(true);
    if (FormatDataUtils.isEmptyObject(errorFormik.current)) {
      setOpenPopup(true);
    }
  };
  const handleOnClickCancel = () => {
    setTitle("Bạn có chắc chắn muốn hủy trả hàng không?");
    setMessage("");
    setErrorMessage(null);
    setIsConfirm(false);
    setOpenPopup(true);
  };
  const calculateTotalQuantityOfProduct = (product) => {
    let totalQuantity = 0;
    if (product.consignmentList !== undefined && product.consignmentList?.length > 0) {
      product?.consignmentList.forEach((consignment) => {
        const quantity = consignment.quantityReturn;
        totalQuantity = +totalQuantity + quantity;
      });
    }
    return FormatDataUtils.getRoundFloorNumber(totalQuantity);
  };
  const calculateTotalAmount = () => {
    let totalAmount = 0;
    const productList = valueFormik.current.productList;
    if (productList) {
      for (let index = 0; index < productList.length; index++) {
        const product = productList[index];
        const quantity = calculateTotalQuantityOfProduct(product)
        totalAmount = totalAmount + quantity * +product?.unitPrice;
      }
    }
    return totalAmount;
  };
  const handleConfirm = async () => {
    if (isConfirm) {
      const values = valueFormik.current;
      let productList = values.productList;
      let consignmentReturns = [];
      console.log('xác nhận', values);

      for (let index = 0; index < productList.length; index++) {
        const consignments = productList[index]?.consignmentList;
        for (
          let indexConsignment = 0;
          indexConsignment < consignments.length;
          indexConsignment++
        ) {
          let consignment = consignments[indexConsignment];
          const quantityReturn = consignment.quantityReturn
          if (consignment.quantityReturn > consignment.quantity) {
            setErrorMessage(
              'Bạn không thể trả về số lượng lớn hơn số lượng trên đơn hàng',
            );
            setOpenPopup(true);
            return;
          }
          if (consignment.quantityReturn < 0) {
            setErrorMessage('Bạn không thể nhập số lượng nhỏ hơn 0');
            setOpenPopup(true);
            return;
          }

          if (!Number.isInteger(quantityReturn)) {
            setErrorMessage(
              'Vui lòng nhập số lượng trả về với đơn vị nhỏ nhất là số nguyên',
            );
            setOpenPopup(true);
            return;
          }

          if (consignment.quantityReturn > 0) {
            consignmentReturns.push({
              id: consignment.id,
              productId: productList[index].productId,
              quantity: quantityReturn,
              unitPrice: productList[index].unitPrice,
            });
          }
        }
      }
      const returnOrder = {
        //billReferenceNumber: 'XUAT' + exportOrderId,
        //createdDate: new Date().toJSON(),
        description: values.description,
        userId: values.userId,
        consignmentReturns: consignmentReturns,
      };
      console.log('return', returnOrder);
      if (consignmentReturns.length > 0) {
        try {
          const resultResponse = await ExportOrderService.createReturnOrder(returnOrder);
          //const resultResponse = unwrapResult(response);
          console.log(resultResponse);
          if (resultResponse) {
            if (resultResponse.data.message) {
              toast.success(resultResponse.data.message);
            } else {
              toast.success('Tạo phiếu trả hàng thành công');
            }
            console.log(resultResponse);
            navigate(`/export/detail/${exportOrderId}`);
          }
        } catch (error) {
          console.log('Failed to save return order: ', error);
          if (error.message) {
            toast.error(error.message);
          } else {
            toast.error('Lỗi! Trả hàng thất bại!');
          }
        }
      } else {
        setErrorMessage('Bạn không thể trả hàng nếu không có bất kì số lượng trả về nào');
        setOpenPopup(true);
        return;
      }
    } else {
      console.log('Huỷ');
      navigate(`/export/detail/${exportOrderId}`);
    }
  };
  const fetchConsignmentsByExportOrderId = async () => {
    try {
    //   const params = {
    //     // pageIndex: page,
    //     // pageSize: rowsPerPage,
    //     orderId: exportOrderId,
    //   };
      const dataResult = await ExportOrderService.getExportOrderById(exportOrderId);
      //const dataResult = unwrapResult(actionResult);
      if (dataResult.data) {
        setProductList(dataResult.data.productList);
       // setAddressWarehouse(dataResult.data.addressWarehouse);
        // setTotalRecord(dataResult.data.totalRecord);
      }
      console.log('consignments List', dataResult);
    } catch (error) {
      console.log('Failed to fetch consignment list by exportOder: ', error);
    }
  };
  
  
  return <h1>Hello</h1>;
};

export default ReturnGoods;
