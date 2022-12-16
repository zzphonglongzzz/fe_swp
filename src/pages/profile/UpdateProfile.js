import AuthService from "../../service/AuthService";
import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Formik, useField } from "formik";
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
import { Close, Save, PhotoCamera } from "@mui/icons-material";
import FormatDataUtils from "../../utils/FormatDataUtils";
import * as Yup from "yup";
import { differenceInYears } from "date-fns";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import StaffService from "../../service/StaffService";
import moment from "moment";
import { toast } from "react-toastify";
import AlertPopup from "../../component/common/AlertPopup";
import "./Profile.css";

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
const UpdateProfile = () => {
  const staffId = AuthService.getCurrentUser().id;
  const [staff, setStaff] = useState();
  const navigate = useNavigate();
  const [dob, setDob] = useState(null);
  const [touchedDob, setTouchedDob] = useState(false);
  const today = new Date();
  const [image, setImage] = useState();
  const hiddenFileInput = useRef(null);
  const [openPopup, setOpenPopup] = useState(false);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState();
  const [file1, setFile1] = useState(null);
  const [imageUrl, setImageUrl] = useState();

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
        /^([+84|84|0]+(3|5|7|8|9|1[2|6|8|9]))+([0-9]{8,9})$/,
        "Số điện thoại của bạn không hợp lệ"
      ),
    email: Yup.string()
      .max(255, "Email không thể dài quá 255 kí tự")
      .email("Vui lòng nhập đúng định dạng email. VD abc@xyz.com")
      .required("Chưa nhập Email"),
    dob: Yup.date()
      .typeError("Ngày sinh không hợp lệ")
      .required("Chưa nhập ngày sinh")
      .nullable()
      .test("dateOfBirth", "Nhân viên phải ít nhất 18 tuổi", function (value) {
        return differenceInYears(new Date(), new Date(value)) >= 18;
      }),
  });
  const handleUpdateImage = () => {
    console.log("cập nhật ảnh đại diện");
    hiddenFileInput.current.click();
  };
  const handleChangeImageStaff = async (e) => {
    console.log(e.target.files[0].name);
    const file = e.target.files[0];
    if (file.type !== "image/png" && file.type !== "image/jpeg") {
      setTitle("Chú ý");
      setMessage("");
      setErrorMessage("Vui lòng chọn file ảnh có định dạng .png hoặc .jpg");
      setOpenPopup(true);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setTitle("Chú ý");
      setMessage("");
      setErrorMessage("Vui lòng chọn file có dung lượng nhỏ hơn 5MB");
      setOpenPopup(true);
      return;
    }
    setFile1(e.target.files[0].name);
    setImage(URL.createObjectURL(file));
    const formData = new FormData();
    formData.append("file", file);
  };

  const handleSubmit = async (values) => {
    const staff = {
      user_id: staffId,
      full_name: FormatDataUtils.removeExtraSpace(values.fullName),
      dob: moment(values.dob).format("YYYY-MM-DD hh:mm:ss"),
      phone: values.phone,
      email: values.email,
      image: file1 === null ? imageUrl : file1,
    };
    console.log(staff);
    try {
      const dataResult = await StaffService.updateStaff(staff);
      if (dataResult) {
        // let currentUser = AuthService.getCurrentUser();
        // currentUser.username = staff.username;
        // localStorage.setItem("user", JSON.stringify(currentUser));
        toast.success("Cập nhật hồ sơ cá nhân thành công");
        navigate("/profile");
      }
    } catch (error) {
      console.log("Failed to update profile: ", error);
    }
  };
  const fetchProfile = async () => {
    try {
      const dataResult = await StaffService.getProfile();
      console.log("dataResult", dataResult);
      if (dataResult) {
        setStaff(dataResult.data);
        setDob(dataResult.data.dob);
        console.log(
          moment(dataResult.data.dob).utc().format("YYYY-MM-DD hh:mm:ss")
        );
        setImage("/image/" + dataResult.data.image);
        setImageUrl(dataResult.data.image);
      }
    } catch (error) {
      console.log("Failed to fetch staff detail: ", error);
    }
  };
  useEffect(() => {
    fetchProfile();
  }, []);

  return (
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
                  <Grid container spacing={2}>
                    <Grid xs={12} item>
                      <Card>
                        <CardContent>
                          <Stack spacing={3}>
                            <img
                              alt=""
                              name="image"
                              className="imgProfile"
                              accept="image/*"
                              src={image ? image : "/image/default-avatar.jpg"}
                            />
                            <Button
                              variant="outlined"
                              startIcon={<PhotoCamera />}
                              color="warning"
                              fullWidth
                              onClick={() => handleUpdateImage()}
                            >
                              Cập nhật ảnh đại diện
                            </Button>
                            <input
                              accept="image/png, image/gif, image/jpeg"
                              style={{ display: "none" }}
                              ref={hiddenFileInput}
                              onChange={(e) => handleChangeImageStaff(e)}
                              id="upload-file"
                              type="file"
                            />
                          </Stack>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
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
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                              <DatePicker
                                //name="dob"
                                id="dob"
                                label={null}
                                value={dob}
                                inputFormat="dd/MM/yyyy"
                                maxDate={today}
                                onOpen={() => setTouchedDob(true)}
                                onChange={(dob) => {
                                  console.log(dob);
                                  setDob(dob);
                                  setFieldValue("dob", dob);
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
                                margin="3px 14px 0 !important"
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
                        </Grid>
                      </Stack>
                      <Stack
                        direction="row"
                        justifyContent="flex-end"
                        spacing={2}
                        p={2}
                      >
                        <Button
                          variant="contained"
                          startIcon={<Save />}
                          color="success"
                          type="submit"
                          onClick={() => {
                            setTouchedDob(true);
                          }}
                        >
                          Lưu chỉnh sửa
                        </Button>
                        <Button
                          variant="contained"
                          startIcon={<Close />}
                          color="error"
                          onClick={() => navigate("/profile")}
                        >
                          Huỷ
                        </Button>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
              <AlertPopup
                maxWidth="sm"
                title={errorMessage ? "Chú ý" : title}
                openPopup={openPopup}
                setOpenPopup={setOpenPopup}
                isConfirm={!errorMessage}
                handleConfirm={handleSubmit}
              >
                <Box component={"span"} className="popupMessageContainer">
                  {errorMessage ? errorMessage : message}
                </Box>
              </AlertPopup>
            </Form>
          )}
        </Formik>
      )}
    </Box>
  );
};

export default UpdateProfile;
