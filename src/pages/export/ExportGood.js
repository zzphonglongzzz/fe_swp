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
import { Delete, Done} from "@mui/icons-material";
import Select from 'react-select';
import "./ExportGood.scss"

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
    statusName: "",
    creatorId: "",
    createdDate: new Date(),
    productList: [],
  };
  const [productList, setProductList] = useState([]);
  const [openPopup, setOpenPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const today = new Date();
  const currentUser = AuthService.getCurrentUser();
  const arrayHelpersRef = useRef(null);
  const valueFormik = useRef();

  const handleOnChangeProduct = async (e) => {
    const isSelected = valueFormik.current.productList.some((element) => {
      if (element.productId === e.value.productId) {
        return true;
      }

      return false;
    });
    console.log("alo", e);
    const productSelected = {
      productId: e.value.productId,
      productName: e.value.productName,
      productCode: e.value.productCode,
      unitMeasure: e.value.unitMeasure,
      // wrapUnitMeasure: e.value.wrapUnitMeasure,
      //  numberOfWrapUnitMeasure: e.value.numberOfWrapUnitMeasure,
      expirationDate: e.value.expirationDate,
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
        let quantity =
          product.selectedUnitMeasure !== product.unitMeasure
            ? FormatDataUtils.getRoundFloorNumber(
                consignment.quantity * product.numberOfWrapUnitMeasure
              )
            : consignment.quantity;
        let unitPrice =
          product.selectedUnitMeasure !== product.unitMeasure
            ? FormatDataUtils.getRoundFloorNumber(
                product.unitPrice / product.numberOfWrapUnitMeasure
              )
            : product.unitPrice;
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
              const quantity =
                product.selectedUnitMeasure !== product.unitMeasure
                  ? FormatDataUtils.getRoundFloorNumber(
                      consignment.quantity * product.numberOfWrapUnitMeasure
                    )
                  : consignment.quantity;
              totalQuantity = +totalQuantity + quantity;
            });
          }
          const unitPrice =
            product.selectedUnitMeasure !== product.unitMeasure
              ? FormatDataUtils.getRoundFloorNumber(
                  product.unitPrice / product.numberOfWrapUnitMeasure
                )
              : product.unitPrice;
          totalAmount = totalAmount + totalQuantity * unitPrice;
        });
      }
    }
    return totalAmount;
  };
  const handleSubmit = async (values) => {
    console.log("submit value", values);
    let productList = values.productList;
    let consignmentExports = [];
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
        if (consignment.quantity > 0) {
          consignmentExports.push({
            id: consignment.id,
            quantity: product.selectedUnitMeasure
              ? product.selectedUnitMeasure === product.unitMeasure
                ? consignment.quantity
                : FormatDataUtils.getRoundFloorNumber(
                    consignment.quantity * product.numberOfWrapUnitMeasure
                  )
              : consignment.quantity,
            unitPrice: product.selectedUnitMeasure
              ? product.selectedUnitMeasure === product.unitMeasure
                ? product.unitPrice
                : FormatDataUtils.getRoundFloorNumber(
                    product.unitPrice / product.numberOfWrapUnitMeasure
                  )
              : product.unitPrice,
          });
        }
      }
    }
    const dataSubmit = {
      createdDate: new Date(
        today.getTime() - today.getTimezoneOffset() * 60 * 1000
      ).toJSON(),
      userId: currentUser.id,
      consignmentExports: consignmentExports,
    };
    console.log("create new export", dataSubmit);
    if (consignmentExports.length > 0) {
      try {
        const response = await dispatch(createExportOrder(dataSubmit));
        const resultResponse = unwrapResult(response);
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
      const actionResult = await dispatch(getListProductInStock(params));
      const dataResult = unwrapResult(actionResult);
      console.log("dataResult", dataResult);
      if (dataResult.data) {
        // setTotalRecord(dataResult.data.totalRecord);
        setProductList(dataResult.data);
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
      const params = {
        productId: productId,
      };
      const actionResult = await dispatch(
        getListConsiggnmentOfProductInStock(params)
      );
      const dataResult = unwrapResult(actionResult);
      console.log("consignment", dataResult);
      if (dataResult) {
        productSelected = dataResult.productList;
        productSelected.consignments = dataResult.productList?.consignmentList;
        // productSelected.selectedUnitMeasure = dataResult.productList.unitMeasure;
        delete productSelected.consignmentList;
        return productSelected;
      }
    } catch (error) {
      console.log("Failed to fetch consignment list instock: ", error);
    }
  };
  useEffect(() => {
    fetchProductInstock();
  }, []);
  return (
    <Box>
      <Formik
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
                                          {product?.unitPrice}
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
                                                      {consignment?.quantityInstock}
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
            <Popup
              title="Chú ý"
              openPopup={openPopup}
              setOpenPopup={setOpenPopup}
            >
              <Box component={"span"} className="popup-message-container">
                {errorMessage}
              </Box>
            </Popup>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default ExportGood;
