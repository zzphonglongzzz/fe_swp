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
        console.log("B???n vui l??ng ch???n file ??u??i .jpg, .png ????? t???i l??n");
        return;
      }
      if (fileRejections[0].errors[0].code === "file-too-large") {
        console.log("B???n vui l??ng ch???n file ???nh d?????i 5MB ????? t???i l??n");
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
      .max(255, "H??? v?? t??n nh??n vi??n kh??ng th??? d??i qu?? 255 k?? t???")
      .required("Ch??a nh???p H??? v?? t??n nh??n vi??n"),
    phone: Yup.string()
      .required("Ch??a nh???p S??? ??i???n tho???i")
      .test("phone", "Vui l??ng xo?? c??c kho???ng tr???ng", function (value) {
        if (value) {
          return !value.includes(" ");
        }
      })
      .matches(
        /^([\+84|84|0]+(3|5|7|8|9|1[2|6|8|9]))+([0-9]{8,9})$/,
        "S??? ??i???n tho???i c???a b???n kh??ng h???p l???"
      ),
    email: Yup.string()
      .max(255, "Email kh??ng th??? d??i qu?? 255 k?? t???")
      .email("Vui l??ng nh???p ????ng ?????nh d???ng email. VD abc@xyz.com")
      .required("Ch??a nh???p Email"),
    dob: Yup.date()
      .typeError("Ng??y sinh kh??ng h???p l???")
      .required("Ch??a nh???p ng??y sinh")
      .nullable()
      .test("dateOfBirth", "Nh??n vi??n ph???i ??t nh???t 18 tu???i", function (value) {
        return differenceInYears(new Date(), new Date(value)) >= 18;
      }),
    role: Yup.string()
      .trim()
      .max(255, "Ch???c v??? kh??ng th??? d??i qu?? 255 k?? t???")
      .required("Ch??a nh???p Ch???c v???"),
  });
  const fetchStaffDetail = async (staff) => {
    try {
      // const params = {
      //   staffId: staffId,
      // };
      const dataResult = await StaffService.getStaffById(staffId);
      if (dataResult.data && dataResult.data.staff != null) {
        setStaff(dataResult.data.staff);
        setDob(dataResult.data.staff.dob);
        setImageUrl("/image/" + dataResult.data.staff.image);
      } else {
        navigate("/404");
      }
    } catch (error) {
      console.log("Failed to fetch product detail: ", error);
    }
  };
  const handleSubmit = async (values) => {
    //console.log(values);
    const staff = {
      id: staffId,
      fullName: FormatDataUtils.removeExtraSpace(values.fullName),
      dob: moment(values.dob).format("YYYY-MM-DD"),
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
        const actionResult = await StaffService.createStaff(staff);
        if (actionResult.status === 200) {
          toast.success("Th??m th??ng tin nh??n vi??n th??nh c??ng!");
          navigate("/staff/list");
        } else {
          navigate("/staff/list");
          toast.success("Th??m th??ng tin nh??n vi??n th??nh c??ng!");
        }
      } else {
        const actionResult = await StaffService.updateStaff(staff);
        if (actionResult.status === 200) {
          toast.success("S???a s???n th??ng tin nh??n vi??n th??nh c??ng!");
          navigate("/staff/list");
        } else {
          navigate(`/staff/list`);
          toast.success("S???a s???n th??ng tin nh??n vi??n th??nh c??ng!");
        }
      }
    } catch (error) {
      console.log("Failed to save product: ", error);
      if (error.message) {
        toast.error(error.message);
      } else {
        if (isAdd) {
          toast.error("Th??m nh??n vi??n th???t b???i");
        } else {
          toast.error("S???a  nh??n vi??n th???t b???i");
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
                          <Typography variant="h6">???nh ?????i di???n</Typography>
                          <Stack
                            direction="row"
                            padding={1}
                            justifyContent="center"
                          >
                            <div {...getRootProps()} className="preview">
                              <input {...getInputProps()} />
                              {imageUrl && (
                                <img
                                  name="image"
                                  className="imgPreview"
                                  src={imageUrl}
                                />
                              )}
                              <CloudUpload
                                fontSize="large"
                                className="iconUpload"
                              />

                              {isDragActive ? (
                                <span>Th??? ???nh v??o ????y</span>
                              ) : (
                                <span>T???i ???nh l??n</span>
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
                        <Typography variant="h6">Th??ng tin c?? nh??n</Typography>
                        <Stack padding={2}>
                          <Grid container spacing={3}>
                            <Grid xs={6} item>
                              <Typography>H??? v?? t??n</Typography>
                              <TextfieldWrapper
                                name="fullName"
                                fullWidth
                                id="fullName"
                                autoComplete="fullName"
                              />
                            </Grid>
                            <Grid xs={6} item>
                              <Typography>Ng??y sinh</Typography>
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
                                  className="formHelperTextStyle"
                                  error={true}
                                  sx={{ height: "20px" }}
                                >
                                  {errors.dob}
                                </FormHelperText>
                              )}
                            </Grid>
                            <Grid xs={6} item>
                              <Typography>S??? ??i???n tho???i</Typography>
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
                              <Typography>Ch???c v???</Typography>
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
                            Th??m nh??n vi??n
                          </LoadingButton>
                          <Button
                            variant="contained"
                            loading={loadingButton}
                            startIcon={<Close />}
                            color="error"
                            onClick={() => navigate("/staff/list")}
                          >
                            Hu???
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
                          <Typography variant="h6">???nh ?????i di???n</Typography>
                          <Stack
                            direction="row"
                            padding={1}
                            justifyContent="center"
                          >
                            <div {...getRootProps()} className="preview">
                              <input {...getInputProps()} />
                              {imageUrl && (
                                <img
                                  alt=""
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
                                <span>Th??? ???nh v??o ????y</span>
                              ) : (
                                <span>T???i ???nh l??n</span>
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
                        <Typography variant="h6">Th??ng tin c?? nh??n</Typography>
                        <Stack padding={2}>
                          <Grid container spacing={3}>
                            <Grid xs={6} item>
                              <Typography>H??? v?? t??n</Typography>
                              <TextfieldWrapper
                                name="fullName"
                                fullWidth
                                id="fullName"
                                autoComplete="fullName"
                              />
                            </Grid>
                            <Grid xs={6} item>
                              <Typography>Ng??y sinh</Typography>
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
                              <Typography>S??? ??i???n tho???i</Typography>
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
                              <Typography>Ch???c v???</Typography>
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
                            S???a nh??n vi??n
                          </LoadingButton>
                          <Button
                            variant="contained"
                            loading={loadingButton}
                            startIcon={<Close />}
                            color="error"
                            onClick={() => navigate("/staff/list")}
                          >
                            Hu???
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
