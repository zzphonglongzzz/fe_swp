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
  Stack,
  IconButton,
  Divider,
  Button,
} from "@mui/material";
import * as Yup from "yup";
import { FieldArray, Form, Formik, useField } from "formik";
import { Delete, Done } from "@mui/icons-material";
import Select from "react-select";
import "./ExportGood.scss";
import ExportOrderService from "../../service/ExportOrderService";
import AlertPopup from "../../component/common/AlertPopup/index";
import moment from "moment";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));
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
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [isConfirm, setIsConfirm] = useState(false);
  const navigate = useNavigate();
  const currentUser = AuthService.getCurrentUser();
  const arrayHelpersRef = useRef(null);
  const valueFormik = useRef();
  const errorFormik = useRef();
  const FORM_VALIDATION = Yup.object().shape({
    // quantity: Yup.number().required("B???n c?? s???n ph???m ch??a nh???p s??? l?????ng").max(1),
    // manufactorId: Yup.number().required("B???n ch??a ch???n nh?? cung c???p"),
  });
  const handleOnClickConfirm = () => {
    setTitle("B???n c?? ch???c ch???n mu???n x??c nh???n r???ng nh???p kho th??nh c??ng?");
    setMessage("H??y ki???m tra k??? h??ng h??a tr?????c khi x??c nh???n.");
    setIsConfirm(true);
    setOpenPopup(true);
  };
  const handleOnChangeProduct = async (e) => {
    console.log(e.value.productId);
    const isSelected = valueFormik.current.productList.some((element) => {
      if (element.productId === e.value.id) {
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
    //if (isConfirm) {
    console.log("submit value", values);
    let productList = values.productList;
    if (productList.length === 0) {
      setErrorMessage(" Vui l??ng ch???n ??t nh???t 1 s???n ph???m ????? xu???t h??ng");
      setOpenPopup(true);
      return;
    }
    if (productList.unitPrice < productList.importPrice) {
      setErrorMessage("????n gi?? nh???p ??ang l???n h??n ????n gi?? b??n.Vui l??ng xem l???i");
      setOpenPopup(true);
      return;
    }
    for (let index = 0; index < productList.length; index++) {
      if (calculateTotalQuantityOfProduct(productList[index]) === 0) {
        setErrorMessage("B???n c?? s???n ph???m ch??a nh???p s??? l?????ng");
        setOpenPopup(true);
        return;
      }
      const product = productList[index];

      if (product.unitPrice < product.importPrice) {
        setErrorMessage(
          "????n gi?? nh???p ??ang l???n h??n ????n gi?? b??n. B???n vui l??ng xem l???i ????n gi?? b??n"
        );
        setOpenPopup(true);
        return;
      }
      const consignments = productList[index]?.consignments;
      for (
        let indexConsignment = 0;
        indexConsignment < consignments.length;
        indexConsignment++
      ) {
        let consignment = consignments[indexConsignment];
        if (consignment.quantity > consignment.quantityInstock) {
          setErrorMessage(
            "B???n kh??ng th??? nh???p s??? l?????ng l???n h??n s??? l?????ng t???n kho c???a l?? h??ng"
          );
          setOpenPopup(true);
          return;
        }
        if (consignment.quantity < 0) {
          setErrorMessage("B???n kh??ng th??? nh???p s??? l?????ng nh??? h??n 0");
          setOpenPopup(true);
          return;
        }
        // if (consignment.quantity > 0) {
        //   consignmentProductExportList.push({
        //     product_id: product.productId,
        //     consignment_id: consignment.id,
        //     wareHouseId: consignment.warehouseId,
        //     expirationDate: moment(consignment.expirationDate).format(
        //       "YYYY-MM-DD hh:mm:ss"
        //     ),
        //     quantity: consignment.quantity
        //   });
        // }
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
                expirationDate: moment(consignmentItem.expirationDate).format(
                  "YYYY-MM-DD hh:mm:ss"
                ),
                quantity: consignmentItem.quantity,
              };
              if (consignmentItem.quantity > 0)
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
    const dataSubmit = {
      user_Id: currentUser.id,
      productForExport: productForExport,
    };
    if (productForExport.length > 0) {
      try {
        const resultResponse = await ExportOrderService.createExportOrder(
          dataSubmit
        );
        //const resultResponse = unwrapResult(response);
        if (resultResponse) {
          if (resultResponse.data.message) {
            toast.success("T???o phi???u xu???t h??ng th??nh c??ng");
          } else {
            toast.success("T???o phi???u xu???t h??ng th??nh c??ng");
          }
          navigate("/export/list");
        }
      } catch (error) {
        console.log("Failed to save export order: ", error);
        toast.error("T???o phi???u xu???t h??ng th???t b???i");
      }
    } else {
      setErrorMessage("B???n kh??ng c?? l?? h??ng n??o tho??? m??n ??i???u ki???n xu???t h??ng");
      setOpenPopup(true);
      return;
    }
  };
  const fetchProductInstock = async () => {
    try {
      const actionResult = await ExportOrderService.getListProductInStock();
      console.log("dataResult", actionResult);
      if (actionResult.data.listProductInWarehouse) {
        setProductList(actionResult.data.listProductInWarehouse);
        console.log(actionResult.data.listProductInWarehouse);
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
                  <CardHeader title="Th??ng tin c??c s???n ph???m" />
                  <CardContent>
                    {!!productList && (
                      <Select
                        classNamePrefix="select"
                        placeholder="Ch???n s???n ph???m..."
                        noOptionsMessage={() => (
                          <>Kh??ng c?? t??m th???y s???n ph???m n??o</>
                        )}
                        isClearable={true}
                        isSearchable={true}
                        loadingMessage={() => <>??ang t??m ki???m s???n ph???m...</>}
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
                    <TableContainer component={Paper}>
                      <Table
                        sx={{ minWidth: 200 }}
                        aria-label="customized table"
                      >
                        <TableHead>
                          <TableRow>
                            <StyledTableCell className="tableColumnIcon"></StyledTableCell>
                            <StyledTableCell>STT</StyledTableCell>
                            <StyledTableCell>M?? s???n ph???m</StyledTableCell>
                            <StyledTableCell colSpan={2}>
                              T??n s???n ph???m
                            </StyledTableCell>
                            <StyledTableCell>????n v???</StyledTableCell>
                            <StyledTableCell align="center">
                              S??? l?????ng
                            </StyledTableCell>
                            <StyledTableCell align="center">
                              ????n gi?? xu???t
                            </StyledTableCell>
                            <StyledTableCell align="center">
                              ????n gi?? nh???p
                            </StyledTableCell>
                            <StyledTableCell align="center">
                              Th??nh ti???n
                            </StyledTableCell>
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
                                            product?.importPrice || "0"
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
                                                <TableCell>V??? tr??</TableCell>
                                                <TableCell>Ng??y nh???p</TableCell>
                                                <TableCell>
                                                  H???n l??u kho
                                                </TableCell>
                                                <TableCell align="center">
                                                  S??? l?????ng
                                                </TableCell>
                                                <TableCell align="center">
                                                  T???n kho
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
                                                        : "Kh??ng c??"}
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
                  <CardContent>
                    <Box className="totalAmount">
                      <Typography variant="h5" align="center">
                        T???ng ti???n:
                      </Typography>
                      <Typography variant="h5">
                        {FormatDataUtils.formatCurrency(calculateTotalAmount())}
                      </Typography>
                    </Box>
                    <Box className="buttonCreate">
                      <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        loadingPosition="start"
                        //onClick={() => handleOnClickConfirm()}
                        startIcon={<Done />}
                        color="success"
                      >
                        T???o phi???u xu???t kho
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
            <AlertPopup
              title="Ch?? ??"
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
