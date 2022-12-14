import { useNavigate, useParams } from "react-router-dom";
import React, { useEffect, useState, useCallback } from "react";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { Form, Formik } from "formik";
import ProductService from "../../service/ProductService";
import {
  Box,
  Card,
  Grid,
  Typography,
  CardContent,
  TextField,
  Stack,
  Button,
  FormHelperText,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { useField } from "formik";
import "./AddEditProduct.scss";
import { useDropzone } from "react-dropzone";
import CategoryService from "../../service/CategoryService";
import ManfacuturerService from "../../service/ManufacturerService";
import FormatDataUtils from "../../utils/FormatDataUtils";
import { Close, CloudUpload, Done } from "@mui/icons-material";
import "./AddEditProduct.scss";
import Select from "react-select";

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
const AddEditProduct = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [selectedManufacuter, setSelectedManufacturer] = useState("");
  const [loadingButton, setLoadingButton] = useState(false);
  const [categoryList, setCategoryList] = useState([]);
  const [subCategoryList, setSubCategoryList] = useState([]);
  const [manufacturerList, setManufacturerList] = useState([]);
  const [imageUrl, setImageUrl] = useState();
  const [isAdd, setIsAdd] = useState(true);
  const navigate = useNavigate();
  const [formData, setFormData] = useState(new FormData());
  const [file, setFile] = useState([]);

  const onDrop = useCallback((acceptedFiles, fileRejections) => {
    if (!!fileRejections[0]) {
      if (fileRejections[0].errors[0].code === "file-invalid-type") {
        console.log("B???n vui l??ng ch???n file ??u??i .jpg, .png ????? t???i l??n");
        return;
      }
      if (fileRejections[0].errors[0].code === "file-too-large") {
        console.log("B???n vui l??ng ch???n file ???nh d?????i 5MB ????? t???i l??n");
      }
    } else {
      setFile(acceptedFiles[0]);
      const file1 = acceptedFiles[0];
      //console.log(file);
      console.log(file1);
      setImageUrl(URL.createObjectURL(file1));
      //console.log(imageUrl)
      const formData = new FormData();
      formData.append("file", file1);
      //console.log(formData);
      setFormData(formData);
    }
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/png": [".png"],
      "image/jpeg": [".jpg"],
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    multiple: false,
  });

  const initialFormValue = {
    productCode: "",
    name: "",
    unitMeasure: "",
    description: "",
    categoryId: "",
    manufactorId: "",
    subCategoryId: "",
  };
  const FORM_VALIDATION = Yup.object().shape({
    productCode: Yup.string()
      .trim()
      .max(255, "M?? s???n ph???m kh??ng th??? d??i qu?? 255 k?? t???")
      .required("Ch??a nh???p m?? s???n ph???m")
      .test("productCode", "Vui l??ng xo?? c??c kho???ng tr???ng", function (value) {
        if (value) {
          return !value.includes(" ");
        }
      }),
    name: Yup.string()
      .trim()
      .max(255, "T??n s???n ph???m kh??ng th??? d??i qu?? 255 k?? t???")
      .required("Ch??a nh???p t??n s???n ph???m"),
    unitMeasure: Yup.string()
      .trim()
      .max(255, "????n v??? kh??ng th??? d??i qu?? 255 k?? t???")
      .required("Ch??a nh???p ????n v???"),
    description: Yup.string().max(255, "M?? t??? kh??ng th??? d??i qu?? 255 k?? t???"),
    categoryId: Yup.string().required("Ch??a ch???n danh m???c"),
    subCategoryId: Yup.string().required("Ch??a ch???n danh m???c ph???"),
    manufactorId: Yup.string().required("Ch??a ch???n nh?? cung c???p"),
    lastAveragePrice: Yup.number(),
    unitprice: Yup.number()
      .required("Ch??a nh???p ????n gi?? b??n")
      .positive("Vui l??ng nh???p s??? d????ng")
      .moreThan(
        Yup.ref("lastAveragePrice"),
        "Vui l??ng nh???p ????n gi?? xu???t l???n h??n"
      ),
  });
  const FORM_VALIDATION1 = Yup.object().shape({
    productCode: Yup.string()
      .trim()
      .max(255, "M?? s???n ph???m kh??ng th??? d??i qu?? 255 k?? t???")
      .required("Ch??a nh???p m?? s???n ph???m")
      .test("productCode", "Vui l??ng xo?? c??c kho???ng tr???ng", function (value) {
        if (value) {
          return !value.includes(" ");
        }
      }),
    name: Yup.string()
      .trim()
      .max(255, "T??n s???n ph???m kh??ng th??? d??i qu?? 255 k?? t???")
      .required("Ch??a nh???p t??n s???n ph???m"),
    unitMeasure: Yup.string()
      .trim()
      .max(255, "????n v??? kh??ng th??? d??i qu?? 255 k?? t???")
      .required("Ch??a nh???p ????n v???"),
    description: Yup.string().max(255, "M?? t??? kh??ng th??? d??i qu?? 255 k?? t???"),
    categoryId: Yup.string().required("Ch??a ch???n danh m???c"),
    subCategoryId: Yup.string().required("Ch??a ch???n danh m???c ph???"),
    manufactorId: Yup.string().required("Ch??a ch???n nh?? cung c???p"),
  });
  const onChangeCategory = (event) => {
    setSelectedSubCategory(event.value);
    setSelectedCategory(event);
    fetchSubCategoryByCategoryId(event.value);
  };
  const fetchManufacturerList = async () => {
    try {
      const actionResult = await ManfacuturerService.getAllManufacturer();
      if (actionResult.data) {
        setManufacturerList(actionResult.data.manufacturer);
      }
    } catch (error) {
      console.log("Failed to fetch manufacturer list: ", error);
    }
  };
  const fetchCategoryList = async () => {
    try {
      const actionResult = await CategoryService.getCategoryList();
      if (actionResult.data) {
        setCategoryList(actionResult.data.category);
      }
    } catch (error) {
      console.log("Failed to fetch category list: ", error);
    }
  };
  const saveProductDetail = async (product) => {
    try {
      if (!productId) {
        const actionResult = await ProductService.saveProduct(product);
        if (actionResult.status === 200) {
          toast.success("Th??m s???n ph???m th??nh c??ng!");
          navigate("/product");
        } else {
          navigate("/product");
          toast.success("Th??m s???n ph???m th??nh c??ng!");
        }
      } else {
        const actionResult = await ProductService.updateProduct(product);
        if (actionResult.status === 200) {
          toast.success("S???a s???n ph???m th??nh c??ng!");
          navigate("/product");
        } else {
          navigate(`/product/detail/${productId}`);
          toast.success("S???a s???n ph???m th??nh c??ng!");
        }
      }
    } catch (error) {
      console.log("Failed to save product: ", error);
      if (error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        if (isAdd) {
          toast.error("Th??m s???n ph???m th???t b???i");
        } else {
          toast.error("S???a s???n ph???m th???t b???i");
        }
      }
    } finally {
      setLoadingButton(false);
    }
  };
  const handleSubmit = (values) => {
    setLoadingButton(true);
    const newProduct = {
      id: productId,
      name: FormatDataUtils.removeExtraSpace(values.name),
      productCode: FormatDataUtils.removeExtraSpace(values.productCode),
      unit_measure: FormatDataUtils.removeExtraSpace(values.unitMeasure),
      description: FormatDataUtils.removeExtraSpace(values.description),
      unit_price: Math.round(values.unitprice),
      lastAveragePrice: Math.round(values.lastAveragePrice),
      category_id: values.categoryId,
      manufacturer_id: values.manufactorId,
      subCategory_id: values.subCategoryId,
      image: file.path === undefined ? values.image : file.path,
    };
    console.log(newProduct);
    saveProductDetail(newProduct);
  };
  const handleSubmit1 = (values) => {
    setLoadingButton(true);
    const newProduct = {
      id: productId,
      name: FormatDataUtils.removeExtraSpace(values.name),
      productCode: FormatDataUtils.removeExtraSpace(values.productCode),
      unit_measure: FormatDataUtils.removeExtraSpace(values.unitMeasure),
      description: FormatDataUtils.removeExtraSpace(values.description),
      category_id: values.categoryId,
      manufacturer_id: values.manufactorId,
      subCategory_id: values.subCategoryId,
      image: file.path === undefined ? values.image : file.path,
    };
    console.log(newProduct);
    saveProductDetail(newProduct);
  };
  const handleOnClickExit = () => {
    navigate(isAdd ? "/product" : `/product/detail/${productId}`);
  };
  const fetchSubCategoryByCategoryId = async (categoryId) => {
    try {
      const params = {
        categoryId: categoryId,
      };
      const dataResult = await CategoryService.getSubCategoryByCategoryId(
        params
      );
      if (dataResult.data) {
        setSubCategoryList(dataResult.data.subCategory);
      }
    } catch (error) {
      console.log("Failed to fetch subCategory list: ", error);
    }
  };
  const fetchProductDetail = async () => {
    try {
      const params = {
        productId: productId,
      };
      const dataResult = await ProductService.getProductById(params);
      if (dataResult.data) {
        setProduct(dataResult.data.product);
        setSelectedCategory(dataResult.data.product.categoryId);
        setSelectedSubCategory(dataResult.data.product.subCategoryId);
        setSelectedManufacturer(dataResult.data.product.manufactorId);
        fetchSubCategoryByCategoryId(dataResult.data.product.categoryId);
        if (dataResult.data.product.image) {
          setImageUrl("/image/" + dataResult.data.product.image);
        }
      } else {
        navigate("/404");
      }
    } catch (error) {
      console.log("Failed to fetch product detail: ", error);
    }
  };
  useEffect(() => {
    fetchManufacturerList();
    fetchCategoryList();
    if (!!productId) {
      setIsAdd(false);
      if (!!categoryList && !!manufacturerList) {
        if (isNaN(productId)) {
          navigate("/404");
        } else {
          fetchProductDetail();
        }
      }
    }
  }, [productId]);
  return (
    <Box padding="20px">
      <Box>
        {!!product && (
          <Formik
            initialValues={{ ...product }}
            validationSchema={FORM_VALIDATION}
            onSubmit={(values) => handleSubmit(values)}
          >
            {({ values, errors, setFieldValue }) => (
              <Form>
                <Grid container spacing={2}>
                  <Grid xs={9} item>
                    <Grid container spacing={2}>
                      <Grid xs={12} item>
                        <Card>
                          <CardContent>
                            <Typography variant="h6">
                              Th??ng tin s???n ph???m
                            </Typography>
                            <Grid container spacing={2}>
                              <Grid xs={12} item>
                                <Typography className="wrapIcon">
                                  T??n s???n ph???m:
                                  {/* <Info className={classes.iconStyle} /> */}
                                </Typography>
                                <TextfieldWrapper
                                  name="name"
                                  fullWidth
                                  id="name"
                                  autoComplete="name"
                                  autoFocus
                                />
                              </Grid>
                              <Grid xs={6} item>
                                <Typography className="wrapIcon">
                                  M?? s???n ph???m:
                                  {/* <Info className={classes.iconStyle} /> */}
                                </Typography>
                                <TextfieldWrapper
                                  name="productCode"
                                  fullWidth
                                  id="productCode"
                                  autoComplete="productCode"
                                />
                              </Grid>
                              <Grid xs={6} item>
                                <Typography className="wrapIcon">
                                  ????n gi?? nh???p:
                                  {/* <Info className={classes.iconStyle} /> */}
                                </Typography>
                                <TextfieldWrapper
                                  name="lastAveragePrice"
                                  fullWidth
                                  id="lastAveragePrice"
                                  autoComplete="lastAveragePrice"
                                  disabled={true}
                                />
                              </Grid>
                              <Grid xs={6} item>
                                <Typography className="wrapIcon">
                                  ????n v???:
                                </Typography>
                                <TextfieldWrapper
                                  name="unitMeasure"
                                  fullWidth
                                  id="unitMeasure"
                                  autoComplete="unitMeasure"
                                />
                              </Grid>
                              <Grid xs={6} item>
                                <Typography className="wrapIcon">
                                  ????n gi?? b??n:
                                </Typography>
                                <TextfieldWrapper
                                  name="unitprice"
                                  fullWidth
                                  id="unitprice"
                                  autoComplete="unitprice"
                                />
                              </Grid>
                              <Grid xs={12} item>
                                <Typography className="wrapIcon">
                                  M?? t???:
                                </Typography>
                                <TextfieldWrapper
                                  name="description"
                                  fullWidth
                                  multiline
                                  minRows={4}
                                  id="description"
                                  autoComplete="description"
                                />
                              </Grid>
                            </Grid>
                          </CardContent>
                        </Card>
                      </Grid>
                      <Grid xs={12} item></Grid>
                    </Grid>
                  </Grid>
                  <Grid xs={3} item>
                    <Grid container spacing={2}>
                      <Grid xs={12} item>
                        <Card>
                          <CardContent>
                            <Typography variant="h6">Ph??n lo???i</Typography>
                            <Grid container spacing={2}>
                              <Grid xs={12} item>
                                <Typography className="wrapIcon">
                                  Danh m???c:
                                </Typography>
                                {!!categoryList && selectedCategory && (
                                  <Select
                                    classNamePrefix="select"
                                    placeholder="Ch???n danh m???c."
                                    noOptionsMessage={() => (
                                      <>Kh??ng t??m th???y danh m???c ph?? h???p</>
                                    )}
                                    //isClearable={true}
                                    isSearchable={true}
                                    name="categoryId"
                                    value={FormatDataUtils.getSelectedOption(
                                      categoryList,
                                      selectedCategory
                                    )}
                                    options={FormatDataUtils.getOptionWithIdandName(
                                      categoryList
                                    )}
                                    menuPortalTarget={document.body}
                                    styles={{
                                      menuPortal: (base) => ({
                                        ...base,
                                        zIndex: 9999,
                                      }),
                                      control: (base) => ({
                                        ...base,
                                        height: 56,
                                        minHeight: 56,
                                      }),
                                    }}
                                    onChange={(e) => {
                                      setFieldValue("categoryId", e?.value);
                                      onChangeCategory(e);
                                    }}
                                  />
                                )}
                                <FormHelperText
                                  error={true}
                                  className="errorTextHelper"
                                >
                                  {errors.categoryId}
                                </FormHelperText>
                              </Grid>
                              <Grid xs={12} item>
                                <Typography className="wrapIcon">
                                  Danh m???c ph???:
                                </Typography>
                                {subCategoryList && selectedSubCategory && (
                                  <Select
                                    classNamePrefix="select"
                                    placeholder="Ch???n danh m???c ph???"
                                    noOptionsMessage={() => (
                                      <>Kh??ng t??m th???y danh m???c ph??? ph?? h???p</>
                                    )}
                                    //isClearable={true}
                                    isSearchable={true}
                                    name="subCategoryId"
                                    value={FormatDataUtils.getSelectedOption(
                                      subCategoryList,
                                      selectedSubCategory
                                    )}
                                    options={FormatDataUtils.getOptionWithIdandName(
                                      subCategoryList
                                    )}
                                    menuPortalTarget={document.body}
                                    styles={{
                                      menuPortal: (base) => ({
                                        ...base,
                                        zIndex: 9999,
                                      }),
                                      control: (base) => ({
                                        ...base,
                                        height: 56,
                                        minHeight: 56,
                                      }),
                                    }}
                                    onChange={(e) => {
                                      setFieldValue("subCategoryId", e?.value);
                                      setSelectedSubCategory(e);
                                    }}
                                  />
                                )}
                                <FormHelperText
                                  error={true}
                                  className="errorTextHelper"
                                >
                                  {errors.subCategoryId}
                                </FormHelperText>
                              </Grid>
                              <Grid xs={12} item>
                                <Typography className="wrapIcon">
                                  Nh?? cung c???p:
                                </Typography>
                                {manufacturerList && selectedManufacuter && (
                                  <Select
                                    classNamePrefix="select"
                                    placeholder="Ch???n nh?? cung c???p"
                                    noOptionsMessage={() => (
                                      <>Kh??ng t??m th???y nh?? cung c???p ph?? h???p</>
                                    )}
                                    //isClearable={true}
                                    isSearchable={true}
                                    name="manufacturerId"
                                    value={FormatDataUtils.getSelectedOption(
                                      manufacturerList,
                                      selectedManufacuter
                                    )}
                                    options={FormatDataUtils.getOptionWithIdandName(
                                      manufacturerList
                                    )}
                                    menuPortalTarget={document.body}
                                    styles={{
                                      menuPortal: (base) => ({
                                        ...base,
                                        zIndex: 9999,
                                      }),
                                      control: (base) => ({
                                        ...base,
                                        height: 56,
                                        minHeight: 56,
                                      }),
                                    }}
                                    onChange={(e) => {
                                      setFieldValue("manufactorId", e?.value);
                                      setSelectedManufacturer(e);
                                    }}
                                  />
                                )}
                                <FormHelperText
                                  error={true}
                                  className="errorTextHelper"
                                >
                                  {errors.manufactorId}
                                </FormHelperText>
                              </Grid>
                            </Grid>
                          </CardContent>
                        </Card>
                      </Grid>
                      <Grid xs={12} item>
                        <Card className="cardImage">
                          <CardContent sx={{ width: "100%" }}>
                            <Typography variant="h6">???nh s???n ph???m</Typography>
                            <Grid
                              container
                              spacing={0}
                              direction="column"
                              alignItems="center"
                              justify="center"
                            >
                              <Grid xs={12} item>
                                <div {...getRootProps()} className="preview">
                                  <input {...getInputProps()} />
                                  {imageUrl && (
                                    // eslint-disable-next-line jsx-a11y/alt-text
                                    <img
                                      name="image"
                                      className="imgPreview"
                                      src={
                                        imageUrl !== "/image/null"
                                          ? imageUrl
                                          : "/image/default_avatar.jpg"
                                      }
                                      accept="image/*"
                                    />
                                  )}
                                  <CloudUpload
                                    fontSize="large"
                                    className="iconUpload"
                                  />

                                  {isDragActive ? (
                                    <span>K??o ???nh v??o ????y</span>
                                  ) : (
                                    <span>T???i ???nh l??n</span>
                                  )}
                                </div>
                              </Grid>
                            </Grid>
                          </CardContent>
                        </Card>
                      </Grid>
                      <Grid xs={12} item>
                        <Card>
                          <CardContent>
                            <Grid container spacing={2}>
                              <Grid xs={6} item>
                                <LoadingButton
                                  loading={loadingButton}
                                  type="submit"
                                  variant="contained"
                                  fullWidth
                                  loadingposition="start"
                                  startIcon={<Done />}
                                  color="warning"
                                >
                                  L??u ch???nh s???a
                                </LoadingButton>
                              </Grid>
                              <Grid xs={6} item>
                                <Button
                                  onClick={() => handleOnClickExit()}
                                  variant="contained"
                                  fullWidth
                                  startIcon={<Close />}
                                  color="error"
                                >
                                  Hu??? ch???nh s???a
                                </Button>
                              </Grid>
                            </Grid>
                          </CardContent>
                        </Card>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Form>
            )}
          </Formik>
        )}
      </Box>
      {!product && isAdd && (
        <Formik
          initialValues={{ ...initialFormValue }}
          validationSchema={FORM_VALIDATION1}
          onSubmit={(values) => handleSubmit1(values)}
        >
          {({ values, errors, setFieldValue }) => (
            <Form>
              <Grid container spacing={2}>
                <Grid xs={9} item>
                  <Grid container spacing={2}>
                    <Grid xs={12} item>
                      <Card>
                        <CardContent>
                          <Typography variant="h6">
                            Th??ng tin s???n ph???m
                          </Typography>
                          <Grid container spacing={2}>
                            <Grid xs={12} item>
                              <Typography className="wrapIcon">
                                T??n s???n ph???m:
                              </Typography>
                              <TextfieldWrapper
                                name="name"
                                fullWidth
                                id="name"
                                autoComplete="name"
                                autoFocus
                              />
                            </Grid>
                            <Grid xs={6} item>
                              <Typography className="wrapIcon">
                                M?? s???n ph???m:
                              </Typography>
                              <TextfieldWrapper
                                name="productCode"
                                fullWidth
                                id="productCode"
                                autoComplete="productCode"
                              />
                            </Grid>
                            <Grid xs={6} item>
                              <Typography className="wrapIcon">
                                ????n v???:
                              </Typography>
                              <TextfieldWrapper
                                name="unitMeasure"
                                fullWidth
                                id="unitMeasure"
                                autoComplete="unitMeasure"
                              />
                            </Grid>

                            <Grid xs={6} item>
                              <Typography className="wrapIcon">
                                Danh m???c:
                              </Typography>

                              <Select
                                classNamePrefix="select"
                                placeholder="Ch???n danh m???c."
                                noOptionsMessage={() => (
                                  <>Kh??ng t??m th???y danh m???c ph?? h???p</>
                                )}
                                isClearable={true}
                                isSearchable={true}
                                name="categoryId"
                                options={FormatDataUtils.getOptionWithIdandName(
                                  categoryList
                                )}
                                value={FormatDataUtils.getSelectedOption(
                                  categoryList,
                                  selectedCategory
                                )}
                                menuPortalTarget={document.body}
                                styles={{
                                  menuPortal: (base) => ({
                                    ...base,
                                    zIndex: 9999,
                                  }),
                                  control: (base) => ({
                                    ...base,
                                    height: 56,
                                    minHeight: 56,
                                  }),
                                }}
                                onChange={(e) => {
                                  setFieldValue("categoryId", e?.value);
                                  onChangeCategory(e);
                                }}
                              />

                              <FormHelperText
                                error={true}
                                className="errorTextHelper"
                              >
                                {errors.categoryId}
                              </FormHelperText>
                            </Grid>
                            <Grid xs={6} item>
                              <Typography className="wrapIcon">
                                Danh m???c ph???:
                              </Typography>
                              {!!subCategoryList && (
                                <Select
                                  classNamePrefix="select"
                                  placeholder="Ch???n danh m???c ph???"
                                  noOptionsMessage={() => (
                                    <>Kh??ng t??m th???y danh m???c ph?? h???p</>
                                  )}
                                  isClearable={true}
                                  isSearchable={true}
                                  name="subCategoryId"
                                  value={selectedSubCategory}
                                  options={FormatDataUtils.getOptionWithIdandName(
                                    subCategoryList
                                  )}
                                  menuPortalTarget={document.body}
                                  styles={{
                                    menuPortal: (base) => ({
                                      ...base,
                                      zIndex: 9999,
                                    }),
                                    control: (base) => ({
                                      ...base,
                                      height: 56,
                                      minHeight: 56,
                                    }),
                                  }}
                                  onChange={(e) => {
                                    setFieldValue("subCategoryId", e?.value);
                                    setSelectedSubCategory(e);
                                  }}
                                />
                              )}
                               <FormHelperText
                                  error={true}
                                  className="errorTextHelper"
                                >
                                  {errors.subCategoryId}
                                </FormHelperText>
                            </Grid>
                            <Grid xs={12} item>
                              <Typography className="wrapIcon">
                                Nh?? cung c???p:
                              </Typography>
                              <Select
                                classNamePrefix="select"
                                placeholder="Ch???n nh?? cung c???p"
                                noOptionsMessage={() => (
                                  <>Kh??ng c?? t??m th???y nh?? cung c???p ph?? h???p</>
                                )}
                                isClearable={true}
                                isSearchable={true}
                                name="manufacturerId"
                                options={FormatDataUtils.getOptionWithIdandName(
                                  manufacturerList
                                )}
                                menuPortalTarget={document.body}
                                styles={{
                                  menuPortal: (base) => ({
                                    ...base,
                                    zIndex: 9999,
                                  }),
                                  control: (base) => ({
                                    ...base,
                                    height: 56,
                                    minHeight: 56,
                                  }),
                                }}
                                onChange={(e) => {
                                  setFieldValue("manufactorId", e?.value);
                                }}
                              />
                              <FormHelperText
                                error={true}
                                className={"errorTextHelper"}
                              >
                                {errors.manufactorId}
                              </FormHelperText>
                            </Grid>
                            <Grid xs={12} item>
                              <Typography className="wrapIcon">
                                M?? t???:
                              </Typography>
                              <TextfieldWrapper
                                name="description"
                                fullWidth
                                multiline
                                minRows={4}
                                id="description"
                                autoComplete="description"
                              />
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid xs={3} item>
                  <Grid container spacing={2}>
                    <Grid xs={12} item>
                      <Card className="cardImage">
                        <CardContent sx={{ width: "100%" }}>
                          <Typography variant="h6">???nh s???n ph???m</Typography>
                          <Grid
                            container
                            spacing={0}
                            direction="column"
                            alignItems="center"
                            justify="center"
                          >
                            <Grid xs={12} item>
                              <div {...getRootProps()} className="preview">
                                <input {...getInputProps()} />
                                {imageUrl && (
                                  // eslint-disable-next-line jsx-a11y/alt-text
                                  <img
                                    className="imgPreview"
                                    src={imageUrl}
                                    accept="image/*"
                                  />
                                )}
                                <CloudUpload
                                  fontSize="large"
                                  className="iconUpload"
                                />

                                {isDragActive ? (
                                  <span>K??o ???nh v??o ????y</span>
                                ) : (
                                  <span>T???i ???nh l??n</span>
                                )}
                              </div>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid xs={12} item>
                      <Card>
                        <CardContent>
                          <Stack spacing={2}>
                            <Grid xs={8} item>
                              <Button
                                loading={loadingButton}
                                type="submit"
                                variant="contained"
                                loadingposition="start"
                                startIcon={<Done />}
                                color="success"
                                size="medium"
                              >
                                Th??m s???n ph???m
                              </Button>
                            </Grid>
                            <Grid xs={4} item>
                              <Button
                                onClick={() => handleOnClickExit()}
                                variant="contained"
                                fullWidth
                                startIcon={<Close />}
                                color="error"
                                size="medium"
                              >
                                Hu???
                              </Button>
                            </Grid>
                          </Stack>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>
      )}
    </Box>
  );
};
export default AddEditProduct;
