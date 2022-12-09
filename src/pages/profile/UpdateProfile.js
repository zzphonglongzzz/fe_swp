import AuthService from "../../service/AuthService";
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Formik,useField } from "formik";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
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
import { Close, Save } from "@mui/icons-material";
import FormatDataUtils from "../../utils/FormatDataUtils";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { differenceInYears } from 'date-fns';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import StaffService from "../../service/StaffService";

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
      })
  });
  const handleSubmit = async (values) => {
    const staff = {
      id: staffId,
      fullName: FormatDataUtils.removeExtraSpace(values.fullName),
      //identityCard: values.identityCard,
      dateOfBirth: new Date(
        new Date(values.dateOfBirth) + new Date().getTimezoneOffset() / 60
      ).toJSON(),
      phone: values.phone,
      email: values.email,
    };

    try {
      const dataResult = await StaffService.getProfile();
      //const dataResult = unwrapResult(actionResult);
      if (dataResult) {
        let currentUser = AuthService.getCurrentUser();
        currentUser.fullName = staff.fullName;
        localStorage.setItem("user", JSON.stringify(currentUser));
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
        setDob(dataResult.data.dob)
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
      <Container maxWidth="lg">
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
                <Card>
                  <CardContent>
                    <Typography variant="h6">Thông tin cá nhân</Typography>
                    <Stack padding={2}>
                      <Grid container spacing={3}>
                        <Grid xs={6} item>
                          <Typography>
                            Họ và tên
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
                              margin="3px 14px 0 !important"
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
                          </Typography>
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
              </Form>
            )}
          </Formik>
        )}
      </Container>
    </Box>
  );
};

export default UpdateProfile;
