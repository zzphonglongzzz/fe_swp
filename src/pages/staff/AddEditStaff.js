import { useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
import { toast } from "react-toastify";
import * as Yup from "yup";
import LoadingButton from "@mui/lab/LoadingButton";
import { differenceInYears } from "date-fns";
import { Close, CloudUpload, Done } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  FormHelperText,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Form, Formik, useField } from "formik";
import React, { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import StaffService from "../../service/StaffService";
import FormatDataUtils from "../../utils/FormatDataUtils";
import { vi } from "date-fns/locale";
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

const AddStaff = () => {
  const { staffId } = useParams();
  const navigate = useNavigate();
  const today = new Date();
  const [imageUrl, setImageUrl] = useState();
  const [formData, setFormData] = useState(new FormData());
  const [dob, setDob] = useState(null);
  const [errorImage, setErrorImage] = useState("");
  const [touchedDob, setTouchedDob] = useState(false);
  const [isAdd, setIsAdd] = useState(true);
  const [loadingButton, setLoadingButton] = useState(false);
  const [file1, setFile1] = useState([]);
  const [staff, setStaff] = useState();
  //const [dob, setDob] = useState();

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
      setFile1(acceptedFiles[0]);
      const file = acceptedFiles[0];
      //console.log(file);
      console.log(file);
      setImageUrl(URL.createObjectURL(file));
      //console.log(imageUrl)
      const formData = new FormData();
      formData.append("file", file);
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
    fullName: "",
    dob: "",
    phone: "",
    email: "",
    role: "",
  };

  const regexPhone = /^(0[3|5|7|8|9])+([0-9]{8})$/;
  const FORM_VALIDATION = Yup.object().shape({
    fullName: Yup.string()
      .trim()
      .max(255, "Họ và tên nhân viên không thể dài quá 255 kí tự")
      .required("Chưa nhập Họ và tên nhân viên"),
    phone: Yup.string()
      .required("Chưa nhập Số điện thoại")
      .test("phone", "Vui lòng xoá các khoảng trắng", function (value) {
        if (value) {
          return !value.includes(" ");
        }
      })
      .matches(
        /^([\+84|84|0]+(3|5|7|8|9|1[2|6|8|9]))+([0-9]{8,9})$/,
        "Số điện thoại của bạn không hợp lệ"
      ),
    email: Yup.string()
      .max(255, "Email không thể dài quá 255 kí tự")
      .email("Vui lòng nhập đúng định dạng email. VD abc@xyz.com")
      .required("Chưa nhập Email"),
    // dob: Yup.date()
    //   .typeError("Ngày sinh không hợp lệ")
    //   .required("Chưa nhập ngày sinh")
    //   .nullable()
    //   .test("dateOfBirth", "Nhân viên phải ít nhất 18 tuổi", function (value) {
    //     return differenceInYears(new Date(), new Date(value)) >= 18;
    //   }),
    role: Yup.string()
      .trim()
      .max(255, "Chức vụ không thể dài quá 255 kí tự")
      .required("Chưa nhập Chức vụ"),
  });
  const fetchStaffDetail = async (staff) => {
    try {
      // const params = {
      //   staffId: staffId,
      // };
      const dataResult = await StaffService.getStaffById(staffId);
      if (dataResult.data) {
        setStaff(dataResult.data.staff);

        setDob(dataResult.data.staff.dob);
        if (dataResult.data.staff.image) {
          setImageUrl("/image/" + dataResult.data.staff.image);
        }
      } else {
        navigate("/404");
      }
    } catch (error) {
      console.log("Failed to fetch product detail: ", error);
    }
  };
  const handleSubmit = async (values) => {
    console.log(values);
    const staff = {
      fullName: FormatDataUtils.removeExtraSpace(values.fullName),
      dob: moment(values.dateOfBirth).format("YYYY-MM-DD"),
      phone: values.phone,
      email: values.email,
      role: values.role,
      image: file1.path === undefined ? values.image : file1.path,
    };
    console.log(staff);
    saveStaffDetail(staff);
  };
  const saveStaffDetail = async (staff) => {
    try {
      if (!staffId) {
        if (formData.has("file")) {
          const actionResult = await StaffService.createStaff(staff);
          if (actionResult.status === 200) {
            toast.success("Thêm thông tin nhân viên thành công!");
            navigate("/staff/list");
          } else {
            navigate("/staff/list");
            toast.success("Thêm thông tin nhân viên thành công!");
          }
        }
      } else {
        if (formData.has("file")) {
          const actionResult = await StaffService.updateStaff(staff);
          if (actionResult.status === 200) {
            toast.success("Sửa sản thông tin nhân viên thành công!");
            navigate("/staff/list");
          } else {
            navigate(`/staff/list`);
            toast.success("Sửa sản thông tin nhân viên thành công!");
          }
        }
      }
    } catch (error) {
      console.log("Failed to save product: ", error);
      if (error.message) {
        toast.error(error.message);
      } else {
        if (isAdd) {
          toast.error("Thêm nhân viên thất bại");
        } else {
          toast.error("Sửa  nhân viên thất bại");
        }
      }
    } finally {
      setLoadingButton(false);
    }
  };
  useEffect(() => {
    // fetchManufacturerList();
    // fetchCategoryList();
    if (!!staffId) {
      setIsAdd(false);
      if (isNaN(staffId)) {
        navigate("/404");
      } else {
        fetchStaffDetail();
      }
    }
  }, [staffId]);

  return (
    //add staff
    <Box padding="20px">
      <Box>
        {!staff && isAdd && (
          <Formik
            initialValues={{ ...initialFormValue }}
            validationSchema={FORM_VALIDATION}
            onSubmit={(values) => {
              handleSubmit(values);
            }}
          >
            {({ values, errors, setFieldValue }) => (
              <Form>
                <Grid container spacing={2}>
                  <Grid xs={2.5} item>
                    <Stack spacing={2}>
                      <Card>
                        <CardContent>
                          <Typography variant="h6">Ảnh đại diện</Typography>
                          <Stack
                            direction="row"
                            padding={1}
                            justifyContent="center"
                          >
                            <div {...getRootProps()} className="preview">
                              <input {...getInputProps()} />
                              {imageUrl && (
                                <img name="image" className="imgPreview" src={imageUrl} />
                              )}
                              <CloudUpload
                                fontSize="large"
                                className="iconUpload"
                              />

                              {isDragActive ? (
                                <span>Thả ảnh vào đây</span>
                              ) : (
                                <span>Tải ảnh lên</span>
                              )}
                            </div>
                          </Stack>
                          <FormHelperText
                            className="formHelperTextStyle"
                            error={true}
                            sx={{ height: "20px" }}
                          >
                            {errorImage}
                          </FormHelperText>
                        </CardContent>
                      </Card>
                    </Stack>
                  </Grid>
                  <Grid xs={9.5} item>
                    <Card>
                      <CardContent>
                        <Typography variant="h6">Thông tin cá nhân</Typography>
                        <Stack padding={2}>
                          <Grid container spacing={3}>
                            <Grid xs={6} item>
                              <Typography>Họ và tên</Typography>
                              <TextfieldWrapper
                                name="fullName"
                                fullWidth
                                id="fullName"
                                autoComplete="fullName"
                              />
                            </Grid>
                            <Grid xs={6} item>
                              <Typography>Ngày sinh</Typography>
                              <LocalizationProvider
                                dateAdapter={AdapterDateFns}
                              >
                                <DatePicker
                                  id="dob"
                                  label={null}
                                  value={dob}
                                  inputFormat="dd/MM/yyyy"
                                  maxDate={today}
                                  onOpen={() => setTouchedDob(true)}
                                  onChange={(dob) => {
                                    console.log(dob);
                                    setDob(dob);
                                    setFieldValue("dateOfBirth", dob);
                                  }}
                                  renderInput={(params) => (
                                    <TextField
                                      onFocus={() => setTouchedDob(true)}
                                      {...params}
                                    />
                                  )}
                                />
                              </LocalizationProvider>
                              {touchedDob && (
                                <FormHelperText
                                  className="formHelperTextStyle"
                                  error={true}
                                  sx={{ height: "20px" }}
                                >
                                  {errors.dob}
                                </FormHelperText>
                              )}
                            </Grid>
                            <Grid xs={6} item>
                              <Typography>Số điện thoại</Typography>
                              <TextfieldWrapper
                                name="phone"
                                fullWidth
                                id="phone"
                                autoComplete="phone"
                              />
                            </Grid>
                            <Grid xs={6} item>
                              <Typography>Email</Typography>
                              <TextfieldWrapper
                                name="email"
                                fullWidth
                                id="email"
                                autoComplete="email"
                              />
                            </Grid>
                            <Grid xs={12} item>
                              <Typography>Chức vụ</Typography>
                              <TextfieldWrapper
                                name="role"
                                fullWidth
                                id="role"
                                autoComplete="role"
                              />
                            </Grid>
                          </Grid>
                        </Stack>
                        <Stack
                          direction="row"
                          justifyContent="flex-end"
                          spacing={2}
                          p={2}
                        >
                          <LoadingButton
                            variant="contained"
                            loading={loadingButton}
                            startIcon={<Done />}
                            color="success"
                            loadingPosition="start"
                            type="submit"
                          >
                            Thêm nhân viên
                          </LoadingButton>
                          <Button
                            variant="contained"
                            loading={loadingButton}
                            startIcon={<Close />}
                            color="error"
                            onClick={() => navigate("/staff/list")}
                          >
                            Huỷ
                          </Button>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Form>
            )}
          </Formik>
        )}
      </Box>
      <Box>
        {!!staff && (
          <Formik
            initialValues={{ ...staff }}
            validationSchema={FORM_VALIDATION}
            onSubmit={(values) => {
              handleSubmit(values);
            }}
          >
            {({ values, errors, setFieldValue }) => (
              <Form>
                <Grid container spacing={2}>
                  <Grid xs={2.5} item>
                    <Stack spacing={2}>
                      <Card>
                        <CardContent>
                          <Typography variant="h6">Ảnh đại diện</Typography>
                          <Stack
                            direction="row"
                            padding={1}
                            justifyContent="center"
                          >
                            <div {...getRootProps()} className="preview">
                              <input {...getInputProps()} />
                              {imageUrl && (
                                <img className="imgPreview" src={imageUrl} />
                              )}
                              <CloudUpload
                                fontSize="large"
                                className="iconUpload"
                              />

                              {isDragActive ? (
                                <span>Thả ảnh vào đây</span>
                              ) : (
                                <span>Tải ảnh lên</span>
                              )}
                            </div>
                          </Stack>
                          <FormHelperText
                            className="formHelperTextStyle"
                            error={true}
                            sx={{ height: "20px" }}
                          >
                            {errorImage}
                          </FormHelperText>
                        </CardContent>
                      </Card>
                    </Stack>
                  </Grid>
                  <Grid xs={9.5} item>
                    <Card>
                      <CardContent>
                        <Typography variant="h6">Thông tin cá nhân</Typography>
                        <Stack padding={2}>
                          <Grid container spacing={3}>
                            <Grid xs={6} item>
                              <Typography>Họ và tên</Typography>
                              <TextfieldWrapper
                                name="fullName"
                                fullWidth
                                id="fullName"
                                autoComplete="fullName"
                              />
                            </Grid>
                            <Grid xs={6} item>
                              <Typography>Ngày sinh</Typography>
                              <LocalizationProvider
                                dateAdapter={AdapterDateFns}
                              >
                                <DatePicker
                                  id="dob"
                                  //label={null}
                                  //name= "dob"
                                  value={dob}
                                  inputFormat="dd/MM/yyyy"
                                  maxDate={today}
                                  // onOpen={() => setTouchedDob(true)}
                                  onChange={(dob) => {
                                    console.log(dob);
                                    setDob(dob);
                                    setFieldValue("dateOfBirth", dob);
                                  }}
                                  renderInput={(params) => (
                                    <TextField
                                      onFocus={() => setTouchedDob(true)}
                                      {...params}
                                    />
                                  )}
                                />
                              </LocalizationProvider>
                              {touchedDob && (
                                <FormHelperText
                                  className="formHelperTextStyle"
                                  error={true}
                                  sx={{ height: "20px" }}
                                >
                                  {errors.dateOfBirth}
                                </FormHelperText>
                              )}
                            </Grid>
                            <Grid xs={6} item>
                              <Typography>Số điện thoại</Typography>
                              <TextfieldWrapper
                                name="phone"
                                fullWidth
                                id="phone"
                                autoComplete="phone"
                              />
                            </Grid>
                            <Grid xs={6} item>
                              <Typography>Email</Typography>
                              <TextfieldWrapper
                                name="email"
                                fullWidth
                                id="email"
                                autoComplete="email"
                              />
                            </Grid>
                            <Grid xs={6} item>
                              <Typography>Chức vụ</Typography>
                              <TextfieldWrapper
                                name="role"
                                fullWidth
                                id="role"
                                autoComplete="role"
                              />
                            </Grid>
                          </Grid>
                        </Stack>
                        <Stack
                          direction="row"
                          justifyContent="flex-end"
                          spacing={2}
                          p={2}
                        >
                          <LoadingButton
                            variant="contained"
                            loading={loadingButton}
                            startIcon={<Done />}
                            color="success"
                            loadingPosition="start"
                            type="submit"
                          >
                            Sửa nhân viên
                          </LoadingButton>
                          <Button
                            variant="contained"
                            loading={loadingButton}
                            startIcon={<Close />}
                            color="error"
                            onClick={() => navigate("/staff/list")}
                          >
                            Huỷ
                          </Button>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Form>
            )}
          </Formik>
        )}
      </Box>
    </Box>
  );
};

export default AddStaff;
