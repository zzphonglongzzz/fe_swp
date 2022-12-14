import { FieldArray, Form, Formik, useField } from "formik";
import { Fragment, useEffect, useRef, useState } from "react";
import AuthService from "../../service/AuthService";
import {
  Box,
  Card,
  CardContent,
  Divider,
  FormHelperText,
  Grid,
  IconButton,
  Stack,
  Typography,
  TextField,
} from "@mui/material";
import * as Yup from "yup";
import FormatDataUtils from "../../utils/FormatDataUtils";
import Select from "react-select";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "./CreateInventoryChecking.scss";
import { Delete, Done } from "@mui/icons-material";
import LoadingButton from "@mui/lab/LoadingButton";
import InventoryCheckingService from "../../service/InventoryCheckingService";
import WarehouseService from "../../service/WarehouseService";
import "./CreateInventoryChecking.scss";
import AlertPopup from "../../component/common/AlertPopup";
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
const CreateInventoryChecking = () => {
  const [warehouseList, setWarehouseList] = useState([]);
  const [productList, setProductList] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState();
  const [warehouseId, setWarehouseId] = useState("");
  const [openPopup, setOpenPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const user = AuthService.getCurrentUser();
  const arrayHelpersRef = useRef(null);
  const valueFormik = useRef();

  const initialExportOrder = {
    productList: [],
  };
  const FORM_VALIDATION = Yup.object().shape({
    warehouseId: Yup.string().required("B???n ch??a ch???n kho ki???m"),
  });

  const handleChangeWarehouse = (event) => {
    setProductList([]);
    if (event !== null) {
      setWarehouseId(event.value.id);
      fetchProductByWarehouseId(event.value.id);
      setSelectedProduct(null);
    }
  };
  const handleOnChangeProduct = async (e) => {
    setSelectedProduct(e);
    console.log(e);
    const isSelected = valueFormik.current.productList.some((element) => {
      console.log("element 215", element);
      if (element.productId === e.value.id) {
        return true;
      }
      return false;
    });

    const productSelected = {
      productId: e.value.id,
    };
    console.log(productSelected.productId);
    if (isSelected) {
      return;
    } else {
      // productSelected.consignments = consignmentList
      const product = await fetchConsignmentByProductId(
        productSelected.productId
      );
      arrayHelpersRef.current.push(product);
      console.log("productList", product);
    }
  };
  const handleSubmit = async (values, setSubmitting) => {
    setSubmitting(true);
    let listCheckingHistory = [];
    if (!!values.productList) {
      for (let index = 0; index < values.productList.length; index++) {
        const product = values.productList[index];
        const consignments = product.consignmentList;
        for (
          let indexConsignment = 0;
          indexConsignment < consignments.length;
          indexConsignment++
        ) {
          const consignment = consignments[indexConsignment];
          const realityQuantity = consignment.quantity;
          console.log(consignment.realityQuantity);
          if (realityQuantity === "" || isNaN(realityQuantity)) {
            setErrorMessage("B???n c?? s???n ph???m ch??a nh???p s??? l?????ng th???c t???");
            setSubmitting(false);
            setOpenPopup(true);
            return;
          }
          listCheckingHistory.push({
            id: consignment.id,
            productId: product.productId,
            quantityInstock: consignment.quantityInstock,
            quantity: realityQuantity,
            differentAmout: calculateTotalDifferentAmountOfConsignment1(
              product,
              indexConsignment
            ),
            unitPrice:product.unitPrice,
            description: consignment.description,
          });
        }
      }
    }
    if (listCheckingHistory.length > 0) {
      const inventoryChecking = {
        user_Id: user.id,
        warehouse_Id: values.warehouseId,
        total_Different_Amout: calculateTotalDifferentAmountOfOrder(),
        list_StockTakingDetails: listCheckingHistory,
      };
      console.log(inventoryChecking);
      try {
        const resultResponse =
          await InventoryCheckingService.createInventoryChecking(
            inventoryChecking
          );
        if (resultResponse) {
          setSubmitting(false);
          toast.success("T???o phi???u ki???m kho th??nh c??ng");
          navigate("/inventory-checking/list");
        }
      } catch (error) {
        setSubmitting(false);
        console.log("Failed to save inventoryChecking: ", error);
        toast.error("T???o phi???u ki???m kho th???t b???i");
      }
    } else {
      setSubmitting(false);
      setErrorMessage(" Vui l??ng ch???n ??t nh???t 1 s???n ph???m ????? x??c nh???n ki???m kho");
      setOpenPopup(true);
      return;
    }
    
  };
  const calculateTotalDifferentAmountOfConsignment1 = (
    product,
    indexConsignment
  ) => {
    let totalDifferent = 0;
    if (!!product) {
      const quantity =
        product.consignmentList[indexConsignment].quantityInstock;
      const realityQuantity =
        product.consignmentList[indexConsignment].quantity;
      totalDifferent = realityQuantity - quantity;
    }
    return totalDifferent;
  };
  const calculateTotalDifferentAmountOfConsignment = (
    product,
    indexConsignment
  ) => {
    let totalDifferent = 0;
    if (!!product) {
      const quantity =
        product.consignmentList[indexConsignment].quantityInstock;
      const realityQuantity =
        product.consignmentList[indexConsignment].quantity;
      totalDifferent = FormatDataUtils.getRoundNumber(
        (realityQuantity - quantity) * product.unitPrice
      );
    }
    return totalDifferent;
  };
  const calculateTotalDifferentAmountOfOrder = () => {
    let totalDifferentAmount = 0;
    if (valueFormik.current) {
      const productList = valueFormik.current.productList;
      for (let index = 0; index < productList.length; index++) {
        const product = productList[index];
        const listConsignment = productList[index].consignmentList;
        for (
          let indexConsignment = 0;
          indexConsignment < listConsignment.length;
          indexConsignment++
        ) {
          totalDifferentAmount =
            totalDifferentAmount +
            calculateTotalDifferentAmountOfConsignment(
              product,
              indexConsignment
            );
        }
      }
    }
    return totalDifferentAmount;
  };
  const getAllWarehouse = async (keyword) => {
    try {
      const dataResult = await WarehouseService.getlistWarehouse();
      //const dataResult = unwrapResult(actionResult);
      console.log("warehouse list", dataResult.data.warehouses);
      if (dataResult.data) {
        setWarehouseList(dataResult.data.warehouses);
      }
    } catch (error) {
      console.log("Failed to fetch warehouse list: ", error);
    }
  };
  const fetchProductByWarehouseId = async (warehouseId) => {
    try {
      const dataResult = await InventoryCheckingService.getProductByWarehouseId(
        warehouseId
      );
      //const dataResult = unwrapResult(actionResult);
      console.log("dataResult", dataResult);
      if (dataResult.data) {
        // setTotalRecord(dataResult.data.totalRecord);
        setProductList(dataResult.data.listProductInWarehouse);
      }
    } catch (error) {
      console.log("Failed to fetch product list instock: ", error);
    }
  };
  const fetchConsignmentByProductId = async (productId) => {
    try {
      const params = {
        // pageIndex: page + 1,
        // pageSize: rowsPerPage,
        productId: productId,
        warehouseId: warehouseId,
      };
      const dataResult =
        await InventoryCheckingService.getConsignmentByProductId(params);
      //const dataResult = unwrapResult(actionResult);
      //console.log('consignment', dataResult.data.listProduct);
      if (dataResult) {
        console.log("consignmenList", dataResult.data.listProduct);
        const product = {
          ...dataResult.data.listProduct,
        };
        // product.consignmentList = dataResult.data.listProduct.consignmentList;
        // delete product.consignmentList;
        return product;
      }
    } catch (error) {
      console.log("Failed to fetch consignment list instock: ", error);
    }
  };
  useEffect(() => {
    getAllWarehouse();
  }, []);
  return (
    <Box>
      <Formik
        enableReinitialize={true}
        initialValues={initialExportOrder}
        validationSchema={FORM_VALIDATION}
        onSubmit={(values, { setSubmitting }) => {
          handleSubmit(values, setSubmitting);
        }}
      >
        {({ values, errors, setFieldValue, isSubmitting }) => (
          <Form>
            <Grid container spacing={2}>
              <Grid xs={12} item>
                <Card>
                  <CardContent>
                    <Typography variant="h6">Ch???n kho ki???m</Typography>
                    <Stack
                      direction="row"
                      py={2}
                      justifyContent="space-between"
                    >
                      <Box className="selectBox">
                        {warehouseList && (
                          <Box>
                            <Select
                              classNamePrefix="select"
                              placeholder="Ch???n kho"
                              noOptionsMessage={() => (
                                <>Kh??ng c?? t??m th???y kho n??o</>
                              )}
                              isClearable={true}
                              isSearchable={true}
                              loadingMessage={() => <>??ang t??m ki???m kho...</>}
                              name="warehouse"
                              // value={warehouseId}
                              options={FormatDataUtils.getOption(warehouseList)}
                              menuPortalTarget={document.body}
                              styles={{
                                menuPortal: (base) => ({
                                  ...base,
                                  zIndex: 9999,
                                }),
                              }}
                              onChange={(e) => {
                                setFieldValue("warehouseId", e?.value.id || "");
                                setFieldValue("productList", [], false);
                                handleChangeWarehouse(e);
                              }}
                            />
                            <FormHelperText
                              error={true}
                              className="error-text-helper"
                            >
                              {errors.warehouseId}
                            </FormHelperText>
                          </Box>
                        )}
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
              <Grid xs={12} item>
                <Card>
                  <CardContent className="cardTable">
                    <Typography variant="h6">C??c s???n ph???m ki???m kho</Typography>
                    <br />
                    {productList && (
                      <Select
                        classNamePrefix="select"
                        placeholder="Ch???n s???n ph???m t??? kho tr??n"
                        noOptionsMessage={() => (
                          <>Kh??ng c?? t??m th???y s???n ph???m n??o</>
                        )}
                        isClearable={true}
                        isSearchable={true}
                        loadingMessage={() => <>??ang t??m ki???m s???n ph???m...</>}
                        name="product"
                        value={selectedProduct}
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
                      <Table  sx={{ minWidth: 200 }} aria-label="customized table">
                        <TableHead>
                          <TableRow>
                            <StyledTableCell
                              className="tableColumnIcon"
                              align="center"
                            ></StyledTableCell>
                            <StyledTableCell align="center">STT</StyledTableCell>
                            <StyledTableCell>M?? s???n ph???m</StyledTableCell>
                            <StyledTableCell>T??n s???n ph???m</StyledTableCell>
                            <StyledTableCell>????n v???</StyledTableCell>
                            <StyledTableCell align="center">????n gi??</StyledTableCell>
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
                                      <TableRow
                                        selected={false}
                                      >
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
                                        <TableCell align="center">
                                          {index + 1}
                                        </TableCell>
                                        <TableCell>
                                          {product?.productCode}
                                        </TableCell>
                                        <TableCell>
                                          {product?.productName}
                                        </TableCell>
                                        <TableCell>
                                          {product?.unitMeasure}
                                        </TableCell>
                                        <TableCell align="center">
                                          {FormatDataUtils.formatCurrency(
                                            product?.unitPrice || "0"
                                          )}
                                        </TableCell>
                                      </TableRow>
                                      <TableRow className="rowConsignment">
                                        <TableCell className="tableColumnIcon"></TableCell>
                                        <TableCell
                                          colSpan={5}
                                          className="tableCellConsignment"
                                        >
                                          <Table className="tableCosignment">
                                            <TableBody>
                                              <TableRow>
                                                <TableCell align="center">
                                                  STT l?? h??ng
                                                </TableCell>
                                                <TableCell>Ng??y nh???p</TableCell>
                                                <TableCell>
                                                  H???n l??u kho
                                                </TableCell>
                                                <TableCell align="center">
                                                  S??? l?????ng ?????u
                                                </TableCell>
                                                <TableCell align="center">
                                                  S??? l?????ng th???c t???
                                                </TableCell>
                                                <TableCell align="center">
                                                  M?? t??? chi ti???t
                                                </TableCell>
                                                <TableCell align="center">
                                                  Gi?? tr??? ch??nh l???ch
                                                </TableCell>
                                              </TableRow>
                                              {product?.consignmentList?.map(
                                                (
                                                  consignment,
                                                  indexConsignment
                                                ) => (
                                                  <TableRow
                                                    key={indexConsignment}
                                                  >
                                                    <TableCell align="center">
                                                      {indexConsignment + 1}
                                                    </TableCell>
                                                    <TableCell>
                                                      {FormatDataUtils.formatDateByFormat(
                                                        consignment?.importDate,
                                                        "dd/MM/yyyy"
                                                      )}
                                                    </TableCell>
                                                    <TableCell>
                                                      {consignment?.expirationDate
                                                        ? FormatDataUtils.formatDateByFormat(
                                                            consignment?.expirationDate,
                                                            "dd/MM/yyyy"
                                                          )
                                                        : "Kh??ng c??"}
                                                    </TableCell>
                                                    <TableCell align="center">
                                                      {
                                                        consignment?.quantityInstock
                                                      }
                                                    </TableCell>
                                                    <TableCell align="center">
                                                      <Stack
                                                        direction="row"
                                                        justifyContent="center"
                                                      >
                                                        <TextfieldWrapper
                                                          name={`productList[${index}].consignmentList[${indexConsignment}].quantity`}
                                                          variant="standard"
                                                          className="text-field-quantity"
                                                          type="number"
                                                          InputProps={{
                                                            inputProps: {
                                                              min: 0,
                                                              step: 1,
                                                            },
                                                          }}
                                                        />
                                                      </Stack>
                                                    </TableCell>
                                                    <TableCell align="center">
                                                      <Stack
                                                        direction="row"
                                                        justifyContent="center"
                                                      >
                                                        <TextfieldWrapper
                                                          name={`productList[${index}].consignmentList[${indexConsignment}].description`}
                                                          aria-label="minimum height"
                                                          minRows={5}
                                                          style={{ width: 200 }}
                                                        />
                                                      </Stack>
                                                    </TableCell>
                                                    <TableCell align="center">
                                                      {FormatDataUtils.formatCurrency(
                                                        calculateTotalDifferentAmountOfConsignment(
                                                          product,
                                                          indexConsignment
                                                        )
                                                      )}
                                                    </TableCell>
                                                  </TableRow>
                                                )
                                              )}
                                            </TableBody>
                                          </Table>
                                        </TableCell>
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
                    {/* <Box className="totalDifferentContainer">
                      <Divider />
                      <Stack spacing={2}>
                        <Stack
                          direction="row"
                          p={2}
                          justifyContent="space-between"
                        >
                          <Typography className="labelTotalDifferent">
                            T???ng ch??nh l???ch:
                          </Typography>
                          <Typography className="totalDifferent">
                            <b>
                              {FormatDataUtils.formatCurrency(
                                calculateTotalDifferentAmountOfOrder()
                              )}
                            </b>
                          </Typography>
                        </Stack>
                        <Stack direction="row" justifyContent="flex-end">
                          <LoadingButton
                            variant="contained"
                            color="success"
                            startIcon={<Done />}
                            loading={isSubmitting}
                            loadingposition="start"
                            type="submit"
                          >
                            X??c nh???n ki???m kho
                          </LoadingButton>
                        </Stack>
                      </Stack>
                    </Box> */}
                  </CardContent>
                  <Box className="totalDifferentContainer">
                      <Divider />
                      <Stack spacing={2}>
                        <Stack
                          direction="row"
                          p={2}
                          justifyContent="space-between"
                        >
                          <Typography className="labelTotalDifferent">
                            T???ng ch??nh l???ch:
                          </Typography>
                          <Typography className="totalDifferent">
                            <b>
                              {FormatDataUtils.formatCurrency(
                                calculateTotalDifferentAmountOfOrder()
                              )}
                            </b>
                          </Typography>
                        </Stack>
                        <Stack direction="row" justifyContent="flex-end">
                          <LoadingButton
                            variant="contained"
                            color="success"
                            startIcon={<Done />}
                            loading={isSubmitting}
                            loadingposition="start"
                            type="submit"
                          >
                            X??c nh???n ki???m kho
                          </LoadingButton>
                        </Stack>
                      </Stack>
                    </Box>
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

export default CreateInventoryChecking;
