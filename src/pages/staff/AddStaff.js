import { useNavigate } from "react-router-dom";
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
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Form, Formik } from "formik";
import React, { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import StaffService from "../../service/StaffService"

function Dropzone(props) {
  const { imageUrl, setImageUrl, setFormData, setErrorImage } = props;
  const onDrop = useCallback((acceptedFiles, fileRejections) => {
    // console.log(fileRejections[0]);
    setErrorImage("");
    if (!!fileRejections[0]) {
      //   console.log(fileRejections[0].errors);
      if (fileRejections[0].errors[0].code === "file-invalid-type") {
        console.log("Bạn vui lòng chọn file đuôi .jpg, .png để tải lên");
        setErrorImage("Bạn vui lòng chọn file đuôi .jpg, .png để tải lên");
        return;
      }
      if (fileRejections[0].errors[0].code === "file-too-large") {
        console.log("Bạn vui lòng chọn file ảnh dưới 5MB để tải lên");
        setErrorImage("Bạn vui lòng chọn file ảnh dưới 5MB để tải lên");
        return;
      }
    } else {
      // Do something with the files
      const file = acceptedFiles[0];
      console.log(file);

      setImageUrl(URL.createObjectURL(file));
      const formData = new FormData();
      formData.append("file", file);
      // console.log('inside',...formData)
      setFormData(formData);
    }
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      "image/png": [".png"],
      "image/jpeg": [".jpg"],
    },
    maxSize: 5 * 1024 * 1024, // 5MB
  });
  return (
    <div {...getRootProps()} className="preview">
      <input {...getInputProps()} />
      {imageUrl && <img className="imgPreview" src={imageUrl} />}
      <CloudUpload fontSize="large" className="iconUpload" />

      {isDragActive ? <span>Thả ảnh vào đây</span> : <span>Tải ảnh lên</span>}
    </div>
  );
}
const AddStaff = () => {
  const navigate = useNavigate();
  const today = new Date();
  const [imageUrl, setImageUrl] = useState();
  const [formData, setFormData] = useState(new FormData());
  const [dob, setDob] = useState(null);
  const [errorImage, setErrorImage] = useState("");
  const initialFormValue = {
    fullName: "",
    dateOfBirth: "",
    phone: "",
    email: "",
    role: "",
    addressDetail: "",
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
    dateOfBirth: Yup.date()
      .typeError("Ngày sinh không hợp lệ")
      .required("Chưa nhập ngày sinh")
      .nullable()
      .test("dateOfBirth", "Nhân viên phải ít nhất 18 tuổi", function (value) {
        return differenceInYears(new Date(), new Date(value)) >= 18;
      }),
    addressDetail: Yup.string()
      .trim()
      .max(255, "Địa chỉ chi tiết không thể dài quá 255 kí tự")
      .required("Chưa nhập Địa chỉ chi tiết"),
  });
  const handleSubmit = async (values) => {
    console.log(values);
    const staff = {
      fullName: FormatDataUtils.removeExtraSpace(values.fullName),
      dateOfBirth: new Date(
        new Date(values.dateOfBirth) + new Date().getTimezoneOffset() / 60
      ).toJSON(),
      phone: values.phone,
      email: values.email,
      role: values.role,
      addressDetail: FormatDataUtils.removeExtraSpace(values.addressDetail),
    };
    try {
      const resultResponse = await StaffService.createStaff(staff)
      //const resultResponse = unwrapResult(response);
      console.log(resultResponse);
      if (resultResponse) {
        if (resultResponse.data.message) {
          if (formData.has("file")) {
            const uploadNewImage = await dispatch(
              uploadImageNewStaff(formData)
            ).then(
              (res) => {
                console.log(res.message);
                toast.success("Đăng ký nhân viên thành công!");
                navigate("/staff/list");
              },
              (err) => {
                console.log(err);
              }
            );
            // toast.success(resultResponse.data.message);
          } else {
            navigate("/staff/list");
            toast.success("Đăng ký nhân viên thành công!");
          }
          // console.log(resultResponse);
          // navigate(`/staff/list`);
        } else {
          toast.success("Đăng ký nhân viên thành công");
        }
      }
    } catch (error) {
      console.log("Failed to sign up staff: ", error);
      toast.error(error.message);
    }
  };

  return (
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
                    <Stack direction="row" padding={1} justifyContent="center">
                      <Dropzone
                        // {...userProfile}
                        imageUrl={imageUrl}
                        setImageUrl={setImageUrl}
                        setFormData={setFormData}
                        setErrorImage={setErrorImage}
                      />
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
                        <Typography>
                          Họ và tên
                          <IconRequired />
                        </Typography>
                        <TextfieldWrapper
                          name="fullName"
                          fullWidth
                          id="fullName"
                          autoComplete="fullName"
                        />
                      </Grid>
                      <Grid xs={6} item>
                        <Typography>
                          Ngày sinh
                          <IconRequired />
                        </Typography>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <DatePicker
                            id="birthDate"
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
                            className={classes.formHelperTextStyle}
                            error={true}
                            sx={{ height: "20px" }}
                          >
                            {errors.dateOfBirth}
                          </FormHelperText>
                        )}
                      </Grid>
                      <Grid xs={6} item>
                        <Typography>
                          Số điện thoại
                          <IconRequired />
                        </Typography>
                        <TextfieldWrapper
                          name="phone"
                          fullWidth
                          id="phone"
                          autoComplete="phone"
                        />
                      </Grid>
                      <Grid xs={6} item>
                        <Typography>
                          Email
                          <IconRequired />
                        </Typography>
                        <TextfieldWrapper
                          name="email"
                          fullWidth
                          id="email"
                          autoComplete="email"
                        />
                      </Grid>
                      <Grid xs={12} item>
                        <Typography>
                          Địa chỉ chi tiết
                          <IconRequired />
                        </Typography>
                        <TextfieldWrapper
                          name="addressDetail"
                          fullWidth
                          id="addressDetail"
                          autoComplete="addressDetail"
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
                      startIcon={<Done />}
                      color="success"
                      loading={loading}
                      loadingPosition="start"
                      type="submit"
                    >
                      Thêm nhân viên
                    </LoadingButton>
                    <Button
                      variant="contained"
                      startIcon={<Close />}
                      color="error"
                      disabled={loading}
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
  );
};

export default AddStaff;
