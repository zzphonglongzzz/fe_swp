import { useNavigate, useParams } from "react-router-dom";
import React, { useEffect, useState, useCallback } from "react";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { Form, Formik } from "formik";
import ProductService from "../../service/ProductService";
import { Container } from "@mui/system";
import {
  Box,
  Card,
  CardHeader,
  Grid,
  Typography,
  CardContent,
  TextField,
  Stack,
  Button,
  FormHelperText,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
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
function Dropzone(props) {
  const { imageUrl, setImageUrl, setFormData } = props;
  const onDrop = useCallback((acceptedFiles, fileRejections) => {
    if (!!fileRejections[0]) {
      if (fileRejections[0].errors[0].code === "file-invalid-type") {
        console.log("Bạn vui lòng chọn file đuôi .jpg, .png để tải lên");
        return;
      }
      if (fileRejections[0].errors[0].code === "file-too-large") {
        console.log("Bạn vui lòng chọn file ảnh dưới 5MB để tải lên");
      }
    } else {
      const file = acceptedFiles[0];
      console.log(file);
      setImageUrl(URL.createObjectURL(file));
      const formData = new FormData();
      formData.append("file", file);
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

  return (
    <div {...getRootProps()} className="preview">
      <input {...getInputProps()} />
      {imageUrl && (
        // eslint-disable-next-line jsx-a11y/alt-text
        <img className="imgPreview" src={imageUrl} />
      )}
      <CloudUpload fontSize="large" className="iconUpload" />

      {isDragActive ? <span>Kéo ảnh vào đây</span> : <span>Tải ảnh lên</span>}
    </div>
  );
}
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
      .max(255, "Mã sản phẩm không thể dài quá 255 kí tự")
      .required("Chưa nhập mã sản phẩm")
      .test("productCode", "Vui lòng xoá các khoảng trắng", function (value) {
        if (value) {
          return !value.includes(" ");
        }
      }),
    name: Yup.string()
      .trim()
      .max(255, "Tên sản phẩm không thể dài quá 255 kí tự")
      .required("Chưa nhập tên sản phẩm"),
    unitMeasure: Yup.string()
      .trim()
      .max(255, "Đơn vị không thể dài quá 255 kí tự")
      .required("Chưa nhập đơn vị"),
    description: Yup.string().max(255, "Mô tả không thể dài quá 255 kí tự"),
    categoryId: Yup.string().required("Chưa chọn danh mục"),
    subCategoryId: Yup.string().required("Chưa chọn danh mục phụ"),
    manufactorId: Yup.string().required("Chưa chọn nhà cung cấp"),
  });
  const onChangeCategory = (event) => {
    setSelectedSubCategory(null);
    setSelectedCategory(event);
    // fetchSubCategoryByCategoryId(event.value);
  };
  const fetchManufacturerList = async () => {
    try {
      const actionResult = await ManfacuturerService.getManufacturerList();
      if (actionResult.data) {
        setManufacturerList(actionResult.data.manufacturer);
      }
    } catch (error) {
      console.log("Failed to fetch manufacturer list: ", error);
    }
  };
  const fetchCategoryList = async () => {
    try {
      const actionResult = await CategoryService.getAll();
      if (actionResult.data) {
        setCategoryList(actionResult.data.category);
      }
    } catch (error) {
      console.log("Failed to fetch category list: ", error);
    }
  };
  // const saveProductDetail = async (product) => {
  //   try {
  //     if (!productId) {
  //       const actionResult = await dispatch(saveProduct(product));
  //       const dataResult = unwrapResult(actionResult);
  //       if (dataResult.status === 200) {
  //         if (formData.has("file")) {
  //           // const uploadNewImage = await dispatch(
  //           //   uploadNewImageProduct(formData)
  //           // );
  //           toast.success("Thêm sản phẩm thành công!");
  //           navigate("/product");
  //         } else {
  //           navigate("/product");
  //           toast.success("Thêm sản phẩm thành công!");
  //         }
  //       }
  //     } else {
  //       const actionResult = await dispatch(updateProduct(product));
  //       const dataResult = unwrapResult(actionResult);
  //       if (dataResult.status === 200) {
  //         if (formData.has("file")) {
  //           const uploadNewImage = productService
  //             .updateImage(productId, formData)
  //             .then(
  //               (res) => {
  //                 toast.success("Sửa sản phẩm thành công!");
  //                 navigate(`/product/detail/${productId}`);
  //               },
  //               (err) => {
  //                 console.log(err);
  //               }
  //             );
  //         } else {
  //           navigate(`/product/detail/${productId}`);
  //           toast.success("Sửa sản phẩm thành công!");
  //         }
  //       }
  //     }
  //   } catch (error) {
  //     console.log("Failed to save product: ", error);
  //     if (error.message) {
  //       toast.error(error.message);
  //     } else {
  //       if (isAdd) {
  //         toast.error("Thêm sản phẩm thất bại");
  //       } else {
  //         toast.error("Sửa sản phẩm thất bại");
  //       }
  //     }
  //   } finally {
  //     setLoadingButton(false);
  //   }
  // };
  const handleSubmit = (values) => {
    setLoadingButton(true);
    const newProduct = {
      id: productId,
      name: FormatDataUtils.removeExtraSpace(values.name),
      productCode: FormatDataUtils.removeExtraSpace(values.productCode),
      unitMeasure: FormatDataUtils.removeExtraSpace(values.unitMeasure),
      color: FormatDataUtils.removeExtraSpace(values.color),
      description: FormatDataUtils.removeExtraSpace(values.description),
      categoryId: values.categoryId,
      manufactorId: values.manufactorId,
      subCategoryId: values.subCategoryId,
    };
    //saveProductDetail(newProduct);
  };
  const handleOnClickExit = () => {
    navigate(isAdd ? "/product" : `/product/detail/${productId}`);
  };
  // const fetchSubCategoryByCategoryId = async (categoryId) => {
  //   try {
  //     const params = {
  //       categoryId: categoryId,
  //     };
  //     const actionResult = await dispatch(getSubCategoryByCategoryId(params));
  //     const dataResult = unwrapResult(actionResult);
  //     if (dataResult.data) {
  //       console.log(dataResult.data);
  //       setSubCategoryList(dataResult.data.subCategory);
  //     }
  //   } catch (error) {
  //     console.log("Failed to fetch subCategory list: ", error);
  //   }
  // };

  useEffect(() => {
    // const fetchProductDetail = async () => {
    //   try {
    //     const params = {
    //       productId: productId,
    //     };
    //     const actionResult = await dispatch(getProductDetail(params));
    //     const dataResult = unwrapResult(actionResult);
    //     if (dataResult.data) {
    //       console.log(dataResult);
    //       setProduct(dataResult.data.product);
    //       setSelectedCategory(dataResult.data.product.categoryId);
    //       setSelectedSubCategory(dataResult.data.product.subCategoryId);
    //       setSelectedManufacturer(dataResult.data.product.manufactorId);
    //       fetchSubCategoryByCategoryId(dataResult.data.product.categoryId);
    //       if (dataResult.data.product.image) {
    //         setImageUrl(
    //           process.env.REACT_APP_API_URL +
    //             "/" +
    //             dataResult.data.product.image
    //         );
    //       }
    //     } else {
    //       navigate("/404");
    //     }
    //     console.log("dataResult", dataResult);
    //   } catch (error) {
    //     console.log("Failed to fetch product detail: ", error);
    //   }
    // };
    fetchManufacturerList();
    fetchCategoryList();
    if (!!productId) {
      setIsAdd(false);
      if (!!categoryList && !!manufacturerList) {
        if (isNaN(productId)) {
          navigate("/404");
        } else {
          //fetchProductDetail();
        }
      }
    }
  }, []);
  return (
    <Box padding="20px">
      {!product && isAdd && (
        <Formik
          initialValues={{ ...initialFormValue }}
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
                            Thông tin sản phẩm
                          </Typography>
                          <Grid container spacing={2}>
                            <Grid xs={12} item>
                              <Typography className="wrapIcon">
                                Tên sản phẩm:
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
                                Mã sản phẩm:
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
                                Đơn vị:
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
                                Danh mục:
                              </Typography>
                              <Select
                                classNamePrefix="select"
                                placeholder="Chọn danh mục."
                                noOptionsMessage={() => (
                                  <>Không có tìm thấy danh mục phù hợp</>
                                )}
                                isClearable={true}
                                isSearchable={true}
                                name="categoryId"
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
                              <FormHelperText
                                error={true}
                                className="errorTextHelper"
                              >
                                {errors.categoryId}
                              </FormHelperText>
                            </Grid>
                            <Grid xs={6} item>
                              <Typography className="wrapIcon">
                                Danh mục phụ:
                              </Typography>
                              {!!subCategoryList && (
                                <Select
                                  classNamePrefix="select"
                                  placeholder="Chọn danh mục phụ"
                                  noOptionsMessage={() => (
                                    <>Không có tìm thấy danh mục phù hợp</>
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
                            </Grid>
                            <Grid xs={12} item>
                              <Typography className="wrapIcon">
                                Nhà cung cấp:
                              </Typography>
                              <Select
                                classNamePrefix="select"
                                placeholder="Chọn nhà cung cấp"
                                noOptionsMessage={() => (
                                  <>Không có tìm thấy nhà cung cấp phù hợp</>
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
                                Mô tả:
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
                          <Typography variant="h6">Ảnh sản phẩm</Typography>
                          <Grid
                            container
                            spacing={0}
                            direction="column"
                            alignItems="center"
                            justify="center"
                          >
                            <Grid xs={12} item>
                              <Dropzone
                                imageUrl={imageUrl}
                                setImageUrl={setImageUrl}
                                setFormData={setFormData}
                              />
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid xs={12} item>
                      <Card>
                        <CardContent>
                          <Stack spacing={2}>
                            <Grid xs={12} item>
                              <Button
                                loading={loadingButton}
                                type="submit"
                                variant="contained"
                                loadingPosition="start"
                                startIcon={<Done />}
                                color="success"
                                size="medium"
                              >
                                Thêm sản phẩm
                              </Button>
                            </Grid>
                            <Grid xs={8} item>
                              <Button
                                onClick={() => handleOnClickExit()}
                                variant="contained"
                                fullWidth
                                startIcon={<Close />}
                                color="error"
                                size="medium"
                              >
                                Huỷ
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
