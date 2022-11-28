import { FieldArray, Form, Formik,useField } from 'formik';
import { Fragment, useEffect, useRef, useState } from 'react';
import AuthService from "../../service/AuthService"
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  FormHelperText,
  Grid,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  TextField
} from '@mui/material';
import * as Yup from 'yup';
import FormatDataUtils from "../../utils/FormatDataUtils"
import Select from 'react-select';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import "./CreateInventoryChecking.scss"
import {
  Delete,
  Done,
} from '@mui/icons-material';
import LoadingButton from '@mui/lab/LoadingButton';
import Popup from '../../component/common/dialog';

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
   const [warehouseId, setWarehouseId] = useState('');
   const [openPopup, setOpenPopup] = useState(false);
   const [errorMessage, setErrorMessage] = useState('');
   //const hiddenFileInput = useRef(null);
   const navigate = useNavigate();
   const user = AuthService.getCurrentUser();
   const arrayHelpersRef = useRef(null);/*  */
   const valueFormik = useRef();

   const initialExportOrder = {
    createdDate: new Date(),
    description: '',
    productList: [],
  };
   const FORM_VALIDATION = Yup.object().shape({
    warehouseId: Yup.string().required('Bạn chưa chọn kho kiểm'),
  });

   const handleChangeWarehouse = (event) => {
    setProductList([]);
    if (event !== null) {
      setWarehouseId(event.value.id)
      fetchProductByWarehouseId(event.value.id);
      setSelectedProduct(null);
    }
  };
  const handleOnChangeProduct = async (e) => {
    setSelectedProduct(e);
    if (e !== null) {
      const isSelected = valueFormik.current.productList.some((element) => {
        if (element.id === e.value.productId) {
          return true;
        }
        return false;
      });

      const productSelected = {
        productId: e.value.productId,
      };
      if (isSelected) {
        return;
      } else {
        const product = await fetchConsignmentByProductId(productSelected.productId);
        arrayHelpersRef.current.push(product);
      }
    }
  };
  const handleSubmit = async (values, setSubmitting) => {
    setSubmitting(true);
    let listCheckingHistory = [];
    if (!!values.productList) {
      for (let index = 0; index < values.productList.length; index++) {
        const product = values.productList[index];
        const consignments = product.listConsignment;
        for (
          let indexConsignment = 0;
          indexConsignment < consignments.length;
          indexConsignment++
        ) {
          const consignment = consignments[indexConsignment];
          const realityQuantity = consignment.realityQuantity
          console.log(consignment.realityQuantity);
          if (realityQuantity === '' || isNaN(realityQuantity)) {
            setErrorMessage('Bạn có sản phẩm chưa nhập số lượng thực tế');
            setSubmitting(false);
            setOpenPopup(true);
            return;
          }
          listCheckingHistory.push({
            consignmentId: consignment.id,
            instockQuantity: consignment.quantity,
            realityQuantity: realityQuantity,
            differentAmout: calculateTotalDifferentAmountOfConsignment(
              product,
              indexConsignment,
            ),
          });
        }
      }
    }
    if (listCheckingHistory.length > 0) {
      const inventoryChecking = {
        userId: user.id,
        wareHouseId: values.warehouseId,
        totalDifferentAmout: calculateTotalDifferentAmountOfOrder(),
        listCheckingHistoryDetailRequest: listCheckingHistory,
      };
      console.log(inventoryChecking);
      try {
        const resultResponse = await dispatch(createInventoryChecking(inventoryChecking));
        //const resultResponse = unwrapResult(response);
        //console.log('resultResponse', resultResponse);
        if (resultResponse) {
          setSubmitting(false);
          toast.success(resultResponse.data.message);
          navigate('/inventory-checking/list');
        }
      } catch (error) {
        setSubmitting(false);
        console.log('Failed to save inventoryChecking: ', error);
        toast.error('Tạo phiếu kiểm kho thất bại');
      }
    } else {
      setSubmitting(false);
      setErrorMessage(' Vui lòng chọn ít nhất 1 sản phẩm để xác nhận kiểm kho');
      setOpenPopup(true);
      return;
    }
   };
   const calculateTotalDifferentAmountOfConsignment = (product, indexConsignment) => {
    let totalDifferent = 0;
    if (!!product) {
      const quantity = product.listConsignment[indexConsignment].quantity
      const realityQuantity = product.listConsignment[indexConsignment].realityQuantity
      totalDifferent = FormatDataUtils.getRoundNumber(
        (realityQuantity - quantity) * product.unitPrice,
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
        const listConsignment = productList[index].listConsignment;
        for (
          let indexConsignment = 0;
          indexConsignment < listConsignment.length;
          indexConsignment++
        ) {
          totalDifferentAmount =
            totalDifferentAmount +
            calculateTotalDifferentAmountOfConsignment(product, indexConsignment);
        }
      }
    }
    return totalDifferentAmount;
   };
   const getAllWarehouse = async (keyword) => {
    try {
      const dataResult = await dispatch(getAllWarehouseNotPaging());
      //const dataResult = unwrapResult(actionResult);
      console.log('warehouse list', dataResult.data);
      if (dataResult.data) {
        setWarehouseList(dataResult.data.warehouse);
      }
    } catch (error) {
      console.log('Failed to fetch warehouse list: ', error);
    }
  };
  const fetchProductByWarehouseId = async (warehouseId) => {
    try {
      const params = {
        // pageIndex: page + 1,
        // pageSize: rowsPerPage,
        warehouseId: warehouseId,
      };
      const dataResult = await dispatch(getProductByWarehouseId(warehouseId));
      //const dataResult = unwrapResult(actionResult);
      console.log('dataResult', dataResult);
      if (dataResult.data) {
        // setTotalRecord(dataResult.data.totalRecord);
        setProductList(dataResult.data.listProduct);
      }
    } catch (error) {
      console.log('Failed to fetch product list instock: ', error);
    }
   };
   const fetchConsignmentByProductId = async (productId) => {
    try {
      const params = {
        // pageIndex: page + 1,
        // pageSize: rowsPerPage,
        productId: productId,
        warehouseId: warehouseId
      };
      const dataResult = await dispatch(getConsignmentByProductId(params));
      //const dataResult = unwrapResult(actionResult);
      console.log('consignment', dataResult);
      if (dataResult) {
        console.log('consignmenList', dataResult.data.product);
        const product = {
          ...dataResult.data.product,
          selectedUnitMeasure: dataResult.data.product.unitMeasure,
        };
        return product;
      }
    } catch (error) {
      console.log('Failed to fetch consignment list instock: ', error);
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
            <Grid
              container
              spacing={2}
            >
              <Grid
                xs={12}
                item
              >
                <Card>
                  <CardContent>
                    <Typography variant="h6">Chọn kho kiểm</Typography>
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
                              placeholder="Chọn kho"
                              noOptionsMessage={() => <>Không có tìm thấy kho nào</>}
                              isClearable={true}
                              isSearchable={true}
                              loadingMessage={() => <>Đang tìm kiếm kho...</>}
                              name="warehouse"
                              // value={warehouseId}
                              options={FormatDataUtils.getOption(warehouseList)}
                              menuPortalTarget={document.body}
                              styles={{
                                menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                              }}
                              onChange={(e) => {
                                setFieldValue('warehouseId', e?.value.id || '');
                                setFieldValue('productList', [], false);
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
              <Grid
                xs={12}
                item
              >
                <Card>
                  <CardContent className="cardTable">
                    <Typography variant="h6">Các sản phẩm kiểm kho</Typography>
                    <br />
                    {productList && (
                      <Select
                        classNamePrefix="select"
                        placeholder="Chọn sản phẩm từ kho trên"
                        noOptionsMessage={() => <>Không có tìm thấy sản phẩm nào</>}
                        isClearable={true}
                        isSearchable={true}
                        loadingMessage={() => <>Đang tìm kiếm sản phẩm...</>}
                        name="product"
                        value={selectedProduct}
                        options={FormatDataUtils.getOptionProduct(productList)}
                        // options={FormatDataUtils.getOption(productListDataTest)}
                        menuPortalTarget={document.body}
                        styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                        onChange={(e) => handleOnChangeProduct(e)}
                      />
                    )}
                    <br />
                    <Divider />
                    <br />
                    <TableContainer className="tableContainer">
                      <Table className="table">
                        <TableHead>
                          <TableRow>
                            <TableCell
                              className="tableColumnIcon"
                              align="center"
                            ></TableCell>
                            <TableCell align="center">STT</TableCell>
                            <TableCell>Mã sản phẩm</TableCell>
                            <TableCell>Tên sản phẩm</TableCell>
                            <TableCell>Đơn vị</TableCell>
                            <TableCell align="center">Đơn giá</TableCell>
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
                                        // hover
                                        //   selected={islistProductselected}
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
                                        <TableCell align="center">{index + 1}</TableCell>
                                        <TableCell>{product?.productCode}</TableCell>
                                        <TableCell>{product?.name}</TableCell>
                                        <TableCell>
                                          {product?.unitMeasure}
                                        </TableCell>
                                        <TableCell align="center">
                                          {FormatDataUtils.formatCurrency(
                                            product?.unitPrice || '0',
                                          )}
                                        </TableCell>
                                      </TableRow>
                                      <TableRow className="rowConsignment">
                                        <TableCell
                                          className="tableColumnIcon"
                                        ></TableCell>
                                        <TableCell
                                          colSpan={5}
                                          className="tableCellConsignment"
                                        >
                                          <Table className="tableCosignment">
                                            <TableBody>
                                              <TableRow>
                                                <TableCell align="center">
                                                  STT lô hàng
                                                </TableCell>
                                                <TableCell>Ngày nhập</TableCell>
                                                <TableCell>Hạn lưu kho</TableCell>
                                                <TableCell align="center">
                                                  Số lượng đầu
                                                </TableCell>
                                                <TableCell align="center">
                                                  Số lượng thực tế
                                                </TableCell>
                                                <TableCell align="center">
                                                  Giá trị chênh lệch
                                                </TableCell>
                                              </TableRow>
                                              {product?.listConsignment?.map(
                                                (consignment, indexConsignment) => (
                                                  <TableRow key={indexConsignment}>
                                                    <TableCell align="center">
                                                      {indexConsignment + 1}
                                                    </TableCell>
                                                    <TableCell>
                                                      {FormatDataUtils.formatDateByFormat(
                                                        consignment?.importDate,
                                                        'dd/MM/yyyy',
                                                      )}
                                                    </TableCell>
                                                    <TableCell>
                                                      {consignment?.expirationDate
                                                        ? FormatDataUtils.formatDateByFormat(
                                                            consignment?.expirationDate,
                                                            'dd/MM/yyyy',
                                                          )
                                                        : 'Không có'}
                                                    </TableCell>
                                                    <TableCell align="center">
                                                      {consignment?.quantity}
                                                    </TableCell>
                                                    <TableCell align="center">
                                                      <Stack
                                                        direction="row"
                                                        justifyContent="center"
                                                      >
                                                        <TextfieldWrapper
                                                          name={`productList[${index}].listConsignment[${indexConsignment}].realityQuantity`}
                                                          variant="standard"
                                                          className="text-field-quantity"
                                                          type="number"
                                                          InputProps={{
                                                            inputProps: {
                                                              min: 0,
                                                              step:1
                                                            },
                                                          }}
                                                        />
                                                      </Stack>
                                                    </TableCell>
                                                    <TableCell align="center">
                                                      {FormatDataUtils.formatCurrency(
                                                        calculateTotalDifferentAmountOfConsignment(
                                                          product,
                                                          indexConsignment,
                                                        ),
                                                      )}
                                                    </TableCell>
                                                  </TableRow>
                                                ),
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
                    <Box className="totalDifferentContainer">
                      <Divider />
                      <Stack spacing={2}>
                        <Stack
                          direction="row"
                          p={2}
                          justifyContent="space-between"
                        >
                          <Typography className="labelTotalDifferent">
                            Tổng chênh lệch:
                          </Typography>
                          <Typography className="totalDifferent">
                            <b>
                              {FormatDataUtils.formatCurrency(
                                calculateTotalDifferentAmountOfOrder(),
                              )}
                            </b>
                          </Typography>
                        </Stack>
                        <Stack
                          direction="row"
                          justifyContent="flex-end"
                        >
                          <LoadingButton
                            variant="contained"
                            color="success"
                            startIcon={<Done />}
                            loading={isSubmitting}
                            loadingposition="start"
                            type="submit"
                          >
                            Xác nhận kiểm kho
                          </LoadingButton>
                        </Stack>
                      </Stack>
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
              <Box
                component={'span'}
                className="popup-message-container"
              >
                {errorMessage}
              </Box>
            </Popup>
          </Form>
        )}
      </Formik>
    </Box>
   );
}

export default CreateInventoryChecking;