import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { toast } from "react-toastify";
import * as Yup from "yup";
import FormatDataUtils from "../../utils/FormatDataUtils";
import importOrderService from "../../service/ImportOrderService";
import ManfacuturerService from "../../service/ManufacturerService";
import WarehouseService from "../../service/WarehouseService";
import CheckIcon from "@mui/icons-material/Check";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Box,
  Button,
  Card,
  FormHelperText,
  IconButton,
  Stack,
  TextField,
  Grid,
} from "@mui/material";
import { FieldArray, Form, Formik, useField } from "formik";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { vi } from "date-fns/locale";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import "./import.scss";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

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
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const ImportGoods = () => {
  const [manufacturerList, setManufacturerList] = useState([]);
  const [searchManufacturerParams, setSearchManufacturerParams] = useState();
  const [warehouseList, setWarehouseList] = useState([]);
  const [productList, setProductList] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState();
  const [openPopup, setOpenPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loadingButton, setLoadingButton] = useState(false);
  const today = new Date();
  const arrayHelpersRef = useRef(null);
  const valueFormik = useRef();
  const navigate = useNavigate();

  const [initialProductList, setInitialProductList] = useState({
    createdDate: new Date(
      today.getTime() - today.getTimezoneOffset() * 60 * 1000
    ).toJSON(),
    description: "",
    manufactorId: "",
    //userId: currentUser?.id,
    wareHouseId: "",
    consignmentRequests: [],
  });
  const FORM_VALIDATION = Yup.object().shape({
    wareHouseId: Yup.number().required("Bạn chưa chọn kho để nhập hàng"),
    manufactorId: Yup.number().required("Bạn chưa chọn nhà cung cấp"),
    description: Yup.string().max(255, "Mô tả không thể dài quá 255 kí tự"),
  });
  const handleOnChangeManufacturer = (e) => {
    console.log(e);
    setProductList([]);
    setSelectedProduct(null);
    if (e) {
      //getProductListByManufacturerId(e);
    }
  };
  const handleOnChangeProduct = (e) => {
    console.log(e);
    setSelectedProduct(e);
    const isSelected = valueFormik.current.consignmentRequests.some(
      (element) => {
        if (element.productId === e.value.id) {
          return true;
        }

        return false;
      }
    );
    const productSelected = {
      productId: e.value.id,
      name: e.value.name,
      productCode: e.value.productCode,
      unitMeasure: e.value.unitMeasure,
      expirationDate: null,
      quantity: "",
      unitPrice: "",
    };
    if (isSelected) {
      return;
    } else {
      arrayHelpersRef.current.push(productSelected);
    }
  };
  const handleSubmit = (values) => {
    let consignmentRequests = [];
    let consignments = values.consignmentRequests;
    if (consignments.length === 0) {
      setErrorMessage(" Vui lòng chọn ít nhất 1 sản phẩm để nhập hàng");
      setOpenPopup(true);
      return;
    }
    for (let index = 0; index < consignments.length; index++) {
      if (
        consignments[index]?.quantity === "" ||
        consignments[index]?.unitPrice === ""
      ) {
        setErrorMessage("Bạn có sản phẩm chưa nhập số lượng hoặc đơn giá");
        setOpenPopup(true);
        return;
      }
      if (consignments[index]?.quantity === 0) {
        setErrorMessage("Bạn không thể nhập sản phẩm với số lượng bằng 0");
        setOpenPopup(true);
        return;
      }

      if (!Number.isInteger(consignments[index]?.quantity)) {
        setErrorMessage("Vui lòng nhập số lượng sản phẩm là số nguyên");
        setOpenPopup(true);
        return;
      }

      if (!Number.isInteger(consignments[index]?.unitPrice)) {
        setErrorMessage("Vui lòng nhập đơn giá của sản phẩm là số nguyên");
        setOpenPopup(true);
        return;
      }
      consignmentRequests.push({
        productId: consignments[index]?.productId,
        expirationDate: consignments[index]?.expirationDate
          ? new Date(
              consignments[index]?.expirationDate +
                new Date().getTimezoneOffset() / 60
            ).toJSON()
          : null,
        unitPrice: Math.round(consignments[index]?.unitPrice),
        quantity: Math.round(consignments[index]?.quantity),
      });
    }
    const newImportOrder = {
      createdDate: values.createdDate,
      description: values.description,
      //userId: values.userId,
      manufactorId: values.manufactorId,
      wareHouseId: values.wareHouseId,
      consignmentRequests: consignmentRequests,
    };
    setLoadingButton(true);
    importOrderService.createImportOrder(newImportOrder).then(
      (response) => {
        console.log(response.data);
        if (response.data.status === 200) {
          toast.success("Tạo phiếu nhập hàng thành công");
          setLoadingButton(false);
          console.log(response.data);
          navigate("/import/list");
        } else {
          toast.error(response.data.message);
        }
      },
      (error) => {
        if (error.response.data.message) {
          toast.error(error.response.data.message);
          if (error.response.data.status === 405) {
            localStorage.clear();
            navigate("/");
          }
        } else {
          toast.error("Tạo phiếu nhập hàng thất bại");
        }
        setLoadingButton(false);
        console.log(error);
      }
    );
  };
  const calculateTotalAmount = () => {
    let totalAmout = 0;
    if (valueFormik.current !== undefined) {
      const consignments = valueFormik.current.consignmentRequests;
      for (let index = 0; index < consignments.length; index++) {
        totalAmout =
          totalAmout +
          consignments[index].quantity * consignments[index].unitPrice;
      }
    }
    return totalAmout;
  };
  const fetchManufacturerList = async () => {
    try {
      const actionResult = await ManfacuturerService.getManufacturerList();
      if (actionResult.data) {
        setManufacturerList(actionResult.data.manufacturer);
      }
    } catch (error) {
      console.log("Failed to fetch category list: ", error);
    }
  };
  // const getProductListByManufacturerId = async (manufacturerId) => {
  //   try {
  //     const actionResult = await dispatch(getAllProductNotPaging(manufacturerId));
  //     const dataResult = unwrapResult(actionResult);
  //     console.log('dataResult', dataResult);
  //     if (dataResult.data) {
  //       if (dataResult.data.product === null) {
  //         setProductList([]);
  //       } else {
  //         setProductList(dataResult.data.product);
  //       }
  //     }
  //   } catch (error) {
  //     console.log('Failed to fetch product list: ', error);
  //   }
  // };
  const getAllWarehouse = async () => {
    try {
      const actionResult = await WarehouseService.getlistWarehouse();
      console.log("warehouse list", actionResult.data);
      if (actionResult.data) {
        setWarehouseList(actionResult.data.warehouses);
      }
    } catch (error) {
      console.log("Failed to fetch warehouse list: ", error);
    }
  };
  useEffect(() => {
    fetchManufacturerList();
    getAllWarehouse();
  }, []);
  return (
    <Box>
      <Formik
        enableReinitialize={true}
        initialValues={initialProductList}
        validationSchema={FORM_VALIDATION}
        onSubmit={(values) => handleSubmit(values)}
      >
        {({ values, errors, setFieldValue }) => (
          <Form>
            <div className="container">
              <div className="left-container">
                <Card className="card-container">
                  <div className="label">Thông tin đơn hàng</div>
                  <div className="time">
                    {FormatDataUtils.formatDate(today)}
                  </div>
                  <div className="label">Vị trí nhập hàng</div>
                  
                    <Box className="selectbox-warehouse">
                      <Select
                        classNamePrefix="select"
                        placeholder="Chọn kho hàng..."
                        noOptionsMessage={() => <>Không có tìm thấy kho nào</>}
                        isClearable={true}
                        isSearchable={true}
                        name="warehouse"
                        options={FormatDataUtils.getOptionWithIdandName(
                          warehouseList
                        )}
                        menuPortalTarget={document.body}
                        styles={{
                          menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                        }}
                        onChange={(e) => {
                          setFieldValue("wareHouseId", e?.value);
                        }}
                      />
                      <FormHelperText
                        error={true}
                        className="error-text-helper"
                      >
                        {errors.wareHouseId}
                      </FormHelperText>
                    </Box>
                  
                  <div className="label">Thông tin nhà cung cấp</div>
                  <Box>
                    <Select
                      classNamePrefix="select"
                      placeholder="Chọn nhà cung cấp..."
                      noOptionsMessage={() => (
                        <>Không có tìm thấy nhà cung cấp nào</>
                      )}
                      isClearable={true}
                      isSearchable={true}
                      //isLoading={manufacturerState.loading}
                      name="manufacturer"
                      options={FormatDataUtils.getOptionWithIdandName(
                        manufacturerList
                      )}
                      menuPortalTarget={document.body}
                      styles={{
                        menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                      }}
                      onChange={(e) => {
                        setFieldValue("manufactorId", e?.value);
                        setFieldValue("consignmentRequests", [], false);
                        handleOnChangeManufacturer(e?.value);
                      }}
                    />
                    <FormHelperText error={true} className="error-text-helper">
                      {errors.manufactorId}
                    </FormHelperText>
                  </Box>
                  {/* )} */}

                  {/* <pre>{JSON.stringify(errors, null, 2)}</pre> */}
                </Card>
                <Card className="product-list-container">
                  <div className="label">Thông tin các sản phẩm</div>
                  {/* {!!productList && !!values.manufactorId && ( */}
                  <Select
                    classNamePrefix="select"
                    placeholder="Chọn sản phẩm của nhà cung cấp phía trên..."
                    noOptionsMessage={() => <>Không có tìm thấy sản phẩm nào</>}
                    isClearable={true}
                    isSearchable={true}
                    // isLoading={loading}
                    loadingMessage={() => <>Đang tìm kiếm sản phẩm...</>}
                    name="product"
                    value={null}
                    options={FormatDataUtils.getOptionWithIdandName(
                      productList
                    )}
                    menuPortalTarget={document.body}
                    styles={{
                      menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                    }}
                    onChange={(e) => handleOnChangeProduct(e)}
                  />
                  {/* )} */}

                  <hr />
                  <Grid xs={12} item>
                    <TableContainer component={Paper}>
                      <Table
                        sx={{ minWidth: 200 }}
                        aria-label="customized table"
                      >
                        <TableHead>
                          <TableRow>
                            <StyledTableCell></StyledTableCell>
                            <StyledTableCell>STT</StyledTableCell>
                            <StyledTableCell>Mã sản phẩm</StyledTableCell>
                            <StyledTableCell>Tên sản phẩm</StyledTableCell>
                            <StyledTableCell>Ngày hết hạn</StyledTableCell>
                            <StyledTableCell>Đơn vị tính</StyledTableCell>
                            <StyledTableCell>Số lượng</StyledTableCell>
                            <StyledTableCell>Đơn giá</StyledTableCell>
                            <StyledTableCell>Thành tiền</StyledTableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          <FieldArray
                            name="consignmentRequests"
                            render={(arrayHelpers) => {
                              arrayHelpersRef.current = arrayHelpers;
                              valueFormik.current = values;
                              return (
                                <>
                                  {values.consignmentRequests.map(
                                    (item, index) => (
                                      <TableRow key={index}>
                                        <TableCell>
                                          <IconButton
                                            aria-label="delete"
                                            size="large"
                                            onClick={() => {
                                              arrayHelpers.remove(index);
                                            }}
                                          >
                                            <DeleteIcon fontSize="inherit" />
                                          </IconButton>
                                        </TableCell>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>
                                          {item.productCode}
                                        </TableCell>
                                        <TableCell>{item.name}</TableCell>
                                        <TableCell>
                                          <LocalizationProvider
                                            className="date-picker"
                                            locale={vi}
                                            dateAdapter={AdapterDateFns}
                                          >
                                            <DatePicker
                                              onChange={(value) => {
                                                // setFieldValue(`consignmentRequests[${index}].expirationDate`, convertUTCDateToLocalDate(value).toISOString(), false)
                                                // fix bug date
                                                setFieldValue(
                                                  `consignmentRequests[${index}].expirationDate`,
                                                  value,
                                                  false
                                                );
                                                // console.log(value);
                                              }}
                                              minDate={today}
                                              value={
                                                values.consignmentRequests[
                                                  index
                                                ].expirationDate
                                              }
                                              renderInput={(params) => (
                                                <TextField
                                                  variant="standard"
                                                  {...params}
                                                  helperText={null}
                                                />
                                              )}
                                            />
                                          </LocalizationProvider>
                                        </TableCell>
                                        <TableCell>
                                          {item.wrapUnitMeasure == null ? (
                                            item.unitMeasure
                                          ) : (
                                            <Stack
                                              direction="row"
                                              justifyContent="center"
                                            >
                                              <Select
                                                className="unitMeasureSelect"
                                                classNamePrefix="select"
                                                onChange={(e) => {
                                                  setFieldValue(
                                                    `consignmentRequests[${index}].selectedUnitMeasure`,
                                                    e.value.name
                                                  );
                                                  // change quantity when change unitMeasure
                                                  if (
                                                    values.consignmentRequests[
                                                      index
                                                    ].quantity > 0 &&
                                                    e.value.name !==
                                                      values
                                                        .consignmentRequests[
                                                        index
                                                      ].selectedUnitMeasure
                                                  ) {
                                                    if (
                                                      e.value.name ===
                                                      values
                                                        .consignmentRequests[
                                                        index
                                                      ].wrapUnitMeasure
                                                    ) {
                                                      setFieldValue(
                                                        `consignmentRequests[${index}].quantity`,
                                                        Math.round(
                                                          values
                                                            .consignmentRequests[
                                                            index
                                                          ].quantity /
                                                            e.value.number
                                                        )
                                                      );
                                                    }

                                                    if (
                                                      e.value.name ===
                                                      values
                                                        .consignmentRequests[
                                                        index
                                                      ].unitMeasure
                                                    ) {
                                                      setFieldValue(
                                                        `consignmentRequests[${index}].quantity`,
                                                        Math.round(
                                                          values
                                                            .consignmentRequests[
                                                            index
                                                          ].quantity *
                                                            values
                                                              .consignmentRequests[
                                                              index
                                                            ]
                                                              .numberOfWrapUnitMeasure
                                                        )
                                                      );
                                                    }
                                                  }
                                                  // change unitPrice when change unitMeasure
                                                  if (
                                                    values.consignmentRequests[
                                                      index
                                                    ].unitPrice > 0 &&
                                                    e.value.name !==
                                                      values
                                                        .consignmentRequests[
                                                        index
                                                      ].selectedUnitMeasure
                                                  ) {
                                                    if (
                                                      e.value.name ===
                                                      values
                                                        .consignmentRequests[
                                                        index
                                                      ].wrapUnitMeasure
                                                    ) {
                                                      setFieldValue(
                                                        `consignmentRequests[${index}].unitPrice`,
                                                        Math.round(
                                                          values
                                                            .consignmentRequests[
                                                            index
                                                          ].unitPrice *
                                                            e.value.number
                                                        )
                                                      );
                                                    }

                                                    if (
                                                      e.value.name ===
                                                      values
                                                        .consignmentRequests[
                                                        index
                                                      ].unitMeasure
                                                    ) {
                                                      setFieldValue(
                                                        `consignmentRequests[${index}].unitPrice`,
                                                        Math.round(
                                                          values
                                                            .consignmentRequests[
                                                            index
                                                          ].unitPrice /
                                                            values
                                                              .consignmentRequests[
                                                              index
                                                            ]
                                                              .numberOfWrapUnitMeasure
                                                        )
                                                      );
                                                    }
                                                  }
                                                }}
                                                defaultValue={
                                                  FormatDataUtils.getOption([
                                                    {
                                                      number: 1,
                                                      name: item.unitMeasure,
                                                    },
                                                    {
                                                      number:
                                                        item.numberOfWrapUnitMeasure,
                                                      name: item.wrapUnitMeasure,
                                                    },
                                                  ])[0]
                                                }
                                                options={FormatDataUtils.getOption(
                                                  [
                                                    {
                                                      number: 1,
                                                      name: item.unitMeasure,
                                                    },
                                                    {
                                                      number:
                                                        item.numberOfWrapUnitMeasure,
                                                      name: item.wrapUnitMeasure,
                                                    },
                                                  ]
                                                )}
                                                menuPortalTarget={document.body}
                                                styles={{
                                                  menuPortal: (base) => ({
                                                    ...base,
                                                    zIndex: 9999,
                                                  }),
                                                }}
                                              />
                                              {/* {values.consignmentRequests[index]
                                          .selectedUnitMeasure ===
                                          item.wrapUnitMeasure && (
                                          <TooltipUnitMeasure
                                            wrapUnitMeasure={item.wrapUnitMeasure}
                                            numberOfWrapUnitMeasure={
                                              item.numberOfWrapUnitMeasure
                                            }
                                            unitMeasure={item.unitMeasure}
                                            isConvert={false}
                                          />
                                        )} */}
                                            </Stack>
                                          )}
                                        </TableCell>
                                        <TableCell>
                                          <TextfieldWrapper
                                            name={`consignmentRequests[${index}].quantity`}
                                            variant="standard"
                                            className="text-field-quantity"
                                            type={"number"}
                                            InputProps={{
                                              inputProps: {
                                                min: 0,
                                              },
                                            }}
                                          />
                                        </TableCell>
                                        <TableCell>
                                          <TextfieldWrapper
                                            name={`consignmentRequests[${index}].unitPrice`}
                                            variant="standard"
                                            className="text-field-unit-price"
                                            type={"number"}
                                            InputProps={{
                                              inputProps: {
                                                min: 0,
                                              },
                                            }}
                                          />
                                        </TableCell>
                                        <TableCell>
                                          {FormatDataUtils.formatCurrency(
                                            values.consignmentRequests[index]
                                              .quantity *
                                              values.consignmentRequests[index]
                                                .unitPrice
                                          )}
                                        </TableCell>
                                      </TableRow>
                                    )
                                  )}
                                </>
                              );
                            }}
                          ></FieldArray>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                </Card>
                <Stack mt={10} justifyContent="flex-end">
                    <div className="total-amount">
                      <div>Tổng tiền:</div>
                      <div>
                        {FormatDataUtils.formatCurrency(calculateTotalAmount())}
                      </div>
                    </div>
                    <div className="button-import">
                      <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        loading={loadingButton}
                        loadingPosition="start"
                        startIcon={<CheckIcon />}
                        color="success"
                      >
                        Tạo phiếu nhập kho
                      </Button>
                    </div>
                  </Stack>
              </div>
         
                {/* <Card className="order-detail-container">
                  <div className="label">Ghi chú</div>
                  <TextfieldWrapper
                    id="description"
                    className="text-area-note"
                    name="description"
                    variant="outlined"
                    rows={3}
                    multiline
                  />
                </Card> */}
              {/* <AlertPopup
              title="Chú ý"
              openPopup={openPopup}
              setOpenPopup={setOpenPopup}
            >
              <Box
                component={'span'}
                className="popup-message-container"
              >
                {errorMessage}
              </Box>
            </AlertPopup> */}
            </div>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default ImportGoods;
