import { useState, useRef, useEffect, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../../service/AuthService";
import FormatDataUtils from "../../utils/FormatDataUtils";
import { toast } from "react-toastify";
import {
  Box,
  Grid,
  Card,
  Typography,
  TextField,
  CardHeader,
  CardContent,
  TableCell,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Stack,
  IconButton,
  Divider,
} from "@mui/material";
import * as Yup from "yup";
import { FieldArray, Form, Formik, useField } from "formik";
import Popup from "../../component/common/dialog/index";
import LoadingButton from "@mui/lab/LoadingButton";
import { Delete, Done } from "@mui/icons-material";
import Select from "react-select";
import "./ExportGood.scss";
import ProductService from "../../service/ProductService";
import ExportOrderService from "../../service/ExportOrderService";
import AlertPopup from "../../component/common/AlertPopup";
import moment from "moment";

const TextfieldWrapper = ({ name, ...otherProps }) => {
  const [field, meta] = useField(name);

  const configTextfield = {
    ...field,
    ...otherProps,
  };

  if (meta && meta.touched && meta.error) {
    configTextfield.error = true;
    configTextfield.helperText = meta.error;
  }
  return <TextField {...configTextfield} />;
};
const ExportGood = () => {
  const initialExportOrder = {
    // statusName: "",
    // creatorId: "",
    // createdDate: new Date(),
    productList: [],
  };
  const [productList, setProductList] = useState([]);
  const [openPopup, setOpenPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const currentUser = AuthService.getCurrentUser();
  const arrayHelpersRef = useRef(null);
  const valueFormik = useRef();
  
  const FORM_VALIDATION = Yup.object().shape({
    //quantity: Yup.number().required("Bạn chưa số lượng ").min(1),
    ///manufactorId: Yup.number().required("Bạn chưa chọn nhà cung cấp"),
  });
  const handleOnChangeProduct = async (e) => {
    const isSelected = valueFormik.current.productList.some((element) => {
      if (element.productId === e.value.productId) {
        return true;
      }
      return false;
    });
    console.log("alo", e);
    const productSelected = {
      productId: e.value.id,
      productName: e.value.name,
      productCode: e.value.productCode,
      unitMeasure: e.value.unitMeasure,
      // wrapUnitMeasure: e.value.wrapUnitMeasure,
      // numberOfWrapUnitMeasure: e.value.numberOfWrapUnitMeasure,
      // expirationDate: e.value.expirationDate,
      quantity: "",
      unitPrice: e.value.unitPrice,
    };
    if (isSelected) {
      return;
    } else {
      // productSelected.consignments = consignmentList
      arrayHelpersRef.current.push(
        await fetchConsignmentOfProductInstock(
          productSelected.productId,
          productSelected
        )
      );
      // console.log('productList', valueFormik.current);
    }
  };
  const calculateTotalQuantityOfProduct = (product) => {
    let totalQuantity = 0;
    if (
      product.consignments !== undefined &&
      product.consignments?.length > 0
    ) {
      product?.consignments.forEach((consignment) => {
        totalQuantity = +totalQuantity + +consignment.quantity;
      });
    }
    return FormatDataUtils.getRoundFloorNumber(totalQuantity, 2);
  };
  const calculateTotalAmountOfProduct = (product) => {
    let totalAmount = 0;

    if (product !== undefined && product?.consignments?.length > 0) {
      product?.consignments.forEach((consignment) => {
        let quantity = consignment.quantity;
        let unitPrice = product.unitPrice;
        totalAmount = +totalAmount + +quantity * +unitPrice;
      });
    }
    return totalAmount;
  };
  const calculateTotalAmount = () => {
    let totalAmount = 0;
    if (valueFormik.current !== undefined) {
      const productList = valueFormik.current.productList;

      if (productList?.length > 0) {
        productList.forEach((product) => {
          let totalQuantity = 0;
          if (
            product.consignments !== undefined &&
            product.consignments?.length > 0
          ) {
            product.consignments?.forEach((consignment) => {
              const quantity = consignment.quantity;
              totalQuantity = +totalQuantity + quantity;
            });
          }
          const unitPrice = product.unitPrice;
          totalAmount = totalAmount + totalQuantity * unitPrice;
        });
      }
    }
    return totalAmount;
  };
  const handleSubmit = async (values) => {
    console.log("submit value", values);
    let productList = values.productList;
    //let consignmentProductExportList = [];
    //let productForExport = [];
    if (productList.length === 0) {
      setErrorMessage(" Vui lòng chọn ít nhất 1 sản phẩm để xuất hàng");
      setOpenPopup(true);
      return;
    }

    for (let index = 0; index < productList.length; index++) {
      if (calculateTotalQuantityOfProduct(productList[index]) === 0) {
        setErrorMessage("Bạn có sản phẩm chưa nhập số lượng");
        setOpenPopup(true);
        return;
      }
      const product = productList[index];
      const consignments = productList[index]?.consignments;
      for (
        let indexConsignment = 0;
        indexConsignment < consignments.length;
        indexConsignment++
      ) {
        let consignment = consignments[indexConsignment];
        if (consignment.quantity > consignment.quantityInstock) {
          setErrorMessage(
            "Bạn không thể nhập số lượng lớn hơn số lượng tồn kho của lô hàng"
          );
          setOpenPopup(true);
          return;
        }
        if (consignment.quantity < 0) {
          setErrorMessage("Bạn không thể nhập số lượng nhỏ hơn 0");
          setOpenPopup(true);
          return;
        }
      }
    }
    const productForExport = values.productList.reduce(
      (exportProductResult, productListItem) => {
        const productForExportItem = {
          product_id: productListItem.productId,
          consignmentProductExportList: productListItem.consignments.reduce(
            (returnConsignments, consignmentItem) => {
              const consignmentProductExportListItem = {
                consignment_id: consignmentItem.id,
                wareHouseId: consignmentItem.warehouseId,
                expirationDate: moment(consignmentItem.expirationDate)
                  .utc()
                  .format("YYYY-MM-DD hh:mm:ss"),
                quantity: consignmentItem.quantity,
              };
              returnConsignments.push(consignmentProductExportListItem);
              return returnConsignments;
            },
            []
          ),
        };
        exportProductResult.push(productForExportItem);
        return exportProductResult;
      },
      []
    );
    console.log(productForExport);
    // const productForExport = productList.reduce((consignmentProductExportList, index) => {
    //   const product = productList[index];
    //   const consignments = productList[index]?.consignments;
    //   let consignment = consignments[indexConsignment];
    //   consignmentProductExportList.push({
    //     consignment_id: consignment.id,
    //     wareHouseId: consignment.warehouseId,
    //     expirationDate: moment(consignment.expirationDate)
    //       .utc()
    //       .format("YYYY-MM-DD hh:mm:ss"),
    //     quantity: consignment.quantity,
    //   })
    //   return consignmentProductExportList;
    // } , {})
    // for (let index = 0; index < productList.length; index++) {
    //   if (calculateTotalQuantityOfProduct(productList[index]) === 0) {
    //     setErrorMessage("Bạn có sản phẩm chưa nhập số lượng");
    //     setOpenPopup(true);
    //     return;
    //   }
    //   const product = productList[index];
    //   const consignments = productList[index]?.consignments;
    //   productForExport.push({
    //     product: product.productId,
    //     consignmentProductExportList: consignmentProductExportList,
    //   });
    //   for (
    //     let indexConsignment = 0;
    //     indexConsignment < consignments.length;
    //     indexConsignment++
    //   ) {
    //     let consignment = consignments[indexConsignment];
    //     if (consignment.quantity > consignment.quantityInstock) {
    //       setErrorMessage(
    //         "Bạn không thể nhập số lượng lớn hơn số lượng tồn kho của lô hàng"
    //       );
    //       setOpenPopup(true);
    //       return;
    //     }
    //     if (consignment.quantity < 0) {
    //       setErrorMessage("Bạn không thể nhập số lượng nhỏ hơn 0");
    //       setOpenPopup(true);
    //       return;
    //     }
    //     if (consignment.quantity > 0) {
    //       consignmentProductExportList.push({
    //         consignment_id: consignment.id,
    //         wareHouseId: consignment.warehouseId,
    //         expirationDate: moment(consignment.expirationDate)
    //           .utc()
    //           .format("YYYY-MM-DD hh:mm:ss"),
    //         quantity: consignment.quantity,
    //       });
    //     }
    //     // productForExport.push({
    //     //   product: product.productId,
    //     //   consignmentProductExportList: consignmentProductExportList,
    //     // });
    //   }
    // }

    const dataSubmit = {
      user_Id: currentUser.id,
      productForExport: productForExport,
    };
    console.log("create new export", dataSubmit);
    if (productForExport.length > 0) {
      try {
        const resultResponse = await ExportOrderService.createExportOrder(
          dataSubmit
        );
        //const resultResponse = unwrapResult(response);
        if (resultResponse) {
          toast.success("Tạo phiếu xuất hàng thành công");
          console.log(resultResponse);
          navigate("/export/list");
        }
      } catch (error) {
        console.log("Failed to save export order: ", error);
        toast.error("Tạo phiếu xuất hàng thất bại");
      }
    } else {
      setErrorMessage("Bạn không có lô hàng nào thoả mãn điều kiện xuất hàng");
      setOpenPopup(true);
      return;
    }
  };
  const fetchProductInstock = async () => {
    try {
      const params = {
        // pageIndex: page + 1,
        // pageSize: rowsPerPage,
        // ...searchProductParams,
      };
      const actionResult = await ProductService.getAllProductList();
      //const dataResult = unwrapResult(actionResult);
      console.log("dataResult", actionResult);
      if (actionResult.data.product) {
        // setTotalRecord(dataResult.data.totalRecord);
        setProductList(actionResult.data.product);
        // console.log(actionResult.data.product);
      }
    } catch (error) {
      console.log("Failed to fetch product list instock: ", error);
    }
  };
  const fetchConsignmentOfProductInstock = async (
    productId,
    productSelected
  ) => {
    try {
      const dataResult =
        await ExportOrderService.getListConsignmentOfProductInStock(productId);
      //console.log("consignment", dataResult.data.listProduct.consignmentList);
      if (dataResult.data) {
        productSelected = dataResult.data.listProduct;
        productSelected.consignments =
          dataResult.data.listProduct.consignmentList;
        // console.log(productSelected.consignmentList);
        delete productSelected.consignmentList;
        return productSelected;
      }
    } catch (error) {
      console.log("Failed to fetch consignment list instock: ", error);
    }
  };
  useEffect(() => {
    fetchProductInstock();
    fetchConsignmentOfProductInstock();
  }, []);
  return (
    <Box>
      <Formik
        validationSchema={FORM_VALIDATION}
        enableReinitialize={true}
        initialValues={initialExportOrder}
        onSubmit={(values) => handleSubmit(values)}
      >
        {({ values, errors, setFieldValue }) => (
          <Form>
            <Grid container spacing={2}>
              <Grid xs={9} item>
                <Card className="cardTable">
                  <CardHeader title="Thông tin các sản phẩm" />
                  <CardContent>
                    {!!productList && (
                      <Select
                        classNamePrefix="select"
                        placeholder="Chọn sản phẩm..."
                        noOptionsMessage={() => (
                          <>Không có tìm thấy sản phẩm nào</>
                        )}
                        isClearable={true}
                        isSearchable={true}
                        loadingMessage={() => <>Đang tìm kiếm sản phẩm...</>}
                        name="product"
                        value={null}
                        options={FormatDataUtils.getOptionProduct(productList)}
                        menuPortalTarget={document.body}
                        styles={{
                          menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                        }}
                        onChange={(e) => handleOnChangeProduct(e)}
                      />
                    )}
                    <br />
                    <Divider />
                    <br />
                    <TableContainer>
                      <Table className="table">
                        <TableHead>
                          <TableRow>
                            <TableCell className="tableColumnIcon"></TableCell>
                            <TableCell>STT</TableCell>
                            <TableCell>Mã sản phẩm</TableCell>
                            <TableCell colSpan={2}>Tên sản phẩm</TableCell>
                            <TableCell>Đơn vị</TableCell>
                            <TableCell align="center">Số lượng</TableCell>
                            <TableCell align="center">Đơn giá</TableCell>
                            <TableCell align="center">Thành tiền</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          <FieldArray
                            name="productList"
                            render={(arrayHelpers) => {
                              arrayHelpersRef.current = arrayHelpers;
                              valueFormik.current = values;
                              return (
                                <>
                                  {values.productList.map((product, index) => (
                                    <Fragment key={index}>
                                      <TableRow selected={false}>
                                        <TableCell
                                          className="tableColumnIcon"
                                          align="center"
                                        >
                                          <IconButton
                                            aria-label="delete"
                                            size="large"
                                            onClick={() => {
                                              arrayHelpers.remove(index);
                                            }}
                                          >
                                            <Delete fontSize="inherit" />
                                          </IconButton>
                                        </TableCell>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>
                                          {product?.productCode}
                                        </TableCell>
                                        <TableCell colSpan={2}>
                                          {product?.productName}
                                        </TableCell>
                                        <TableCell>
                                          {product?.unitMeasure}
                                        </TableCell>
                                        <TableCell align="center">
                                          {FormatDataUtils.getRoundFloorNumber(
                                            calculateTotalQuantityOfProduct(
                                              product
                                            ),
                                            0
                                          )}
                                        </TableCell>
                                        <TableCell align="center">
                                          {FormatDataUtils.formatCurrency(
                                            product?.unitPrice || "0"
                                          )}
                                        </TableCell>
                                        <TableCell align="center">
                                          {FormatDataUtils.formatCurrency(
                                            calculateTotalAmountOfProduct(
                                              values.productList[index]
                                            )
                                          )}
                                        </TableCell>
                                      </TableRow>
                                      <TableRow className="rowConsignment">
                                        <TableCell className="tableColumnIcon"></TableCell>
                                        <TableCell></TableCell>
                                        <TableCell
                                          colSpan={5}
                                          className="tableCellConsignment"
                                        >
                                          <Table className="tableCosignment">
                                            <TableBody>
                                              <TableRow>
                                                <TableCell>Vị trí</TableCell>
                                                <TableCell>Ngày nhập</TableCell>
                                                <TableCell>
                                                  Hạn lưu kho
                                                </TableCell>
                                                <TableCell align="center">
                                                  Số lượng
                                                </TableCell>
                                                <TableCell align="center">
                                                  Tồn kho
                                                </TableCell>
                                              </TableRow>
                                              {product?.consignments?.map(
                                                (
                                                  consignment,
                                                  indexConsignment
                                                ) => (
                                                  <TableRow
                                                    key={indexConsignment}
                                                  >
                                                    <TableCell>
                                                      {
                                                        consignment?.warehouseName
                                                      }
                                                    </TableCell>
                                                    <TableCell>
                                                      {FormatDataUtils.formatDate(
                                                        consignment?.importDate
                                                      )}
                                                    </TableCell>
                                                    <TableCell>
                                                      {consignment?.expirationDate
                                                        ? FormatDataUtils.formatDate(
                                                            consignment?.expirationDate
                                                          )
                                                        : "Không có"}
                                                    </TableCell>
                                                    <TableCell align="center">
                                                      <Stack
                                                        direction="row"
                                                        justifyContent="center"
                                                      >
                                                        <TextfieldWrapper
                                                          name={`productList[${index}].consignments[${indexConsignment}].quantity`}
                                                          variant="standard"
                                                          className="text-field-quantity"
                                                          type={"number"}
                                                          InputProps={{
                                                            inputProps: {
                                                              min: 0,
                                                              max: consignment?.quantityInstock,
                                                              step: 1,
                                                            },
                                                          }}
                                                        />
                                                      </Stack>
                                                    </TableCell>
                                                    <TableCell align="center">
                                                      {
                                                        consignment?.quantityInstock
                                                      }
                                                    </TableCell>
                                                  </TableRow>
                                                )
                                              )}
                                            </TableBody>
                                          </Table>
                                        </TableCell>
                                        <TableCell></TableCell>
                                      </TableRow>
                                    </Fragment>
                                  ))}
                                </>
                              );
                            }}
                          ></FieldArray>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </CardContent>
                </Card>
              </Grid>
              <Grid xs={3} item>
                <Card>
                  <CardHeader title="Thông tin đơn xuất hàng" />
                  <CardContent className="cardInfo">
                    <Typography>
                      {FormatDataUtils.formatDateTime(new Date())}
                    </Typography>
                    <br />
                  </CardContent>
                  <CardContent>
                    <Box className="totalAmount">
                      <Typography variant="h5" align="center">
                        Tổng tiền:
                      </Typography>
                      <Typography variant="h5">
                        {FormatDataUtils.formatCurrency(calculateTotalAmount())}
                      </Typography>
                    </Box>
                    <Box className="buttonCreate">
                      <LoadingButton
                        type="submit"
                        variant="contained"
                        size="large"
                        loadingPosition="start"
                        startIcon={<Done />}
                        color="success"
                      >
                        Tạo phiếu xuất kho
                      </LoadingButton>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
            <AlertPopup
              title="Chú ý"
              openPopup={openPopup}
              setOpenPopup={setOpenPopup}
            >
              <Box component={"span"} className="popup-message-container">
                {errorMessage}
              </Box>
            </AlertPopup>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default ExportGood;
