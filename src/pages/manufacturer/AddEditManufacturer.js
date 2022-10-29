import { useNavigate, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { Form, Formik } from "formik";
import ManufacturerService from "../../service/ManufacturerService";
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
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import { useField } from "formik";
import "./AddEditManufacturer.scss";

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
const AddEditManufacturer = () => {
  const { manufacturerId } = useParams();
  const navigate = useNavigate();
  const isAdd = !manufacturerId;
  const [manufacturer, setManufacturer] = useState();
  const [loadingButton, setLoadingButton] = useState(false);

  const initialManufacturerValue = {
    name: "",
    email: "",
    phone: "",
    address: "",
  };
  const FORM_VALIDATION = Yup.object().shape({
    name: Yup.string()
      .trim()
      .max(255, "Tên nhà sản xuất không thể dài quá 255 kí tự")
      .required("Chưa nhập tên nhà sản xuất"),
    email: Yup.string()
      .email("Email không hợp lệ")
      .max(255, "Email không thể dài quá 255 kí tự")
      .required("Chưa nhập email nhà sản xuất"),
    phone: Yup.string()
      .required("Chưa nhập số điện thoại nhà sản xuất")
      .test("phone", "Vui lòng xoá các khoảng trắng", function (value) {
        if (value) {
          return !value.includes(" ");
        }
      })
      .matches(
        /^[\+84|84|0]+([0-9]{9,10})$/,
        "Số điện thoại của nhà cung cấp không hợp lệ"
      ),
    address: Yup.string()
      .trim()
      .max(255, "Địa chỉ chi tiết không thể dài quá 255 kí tự")
      .required("Chưa nhập địa chỉ chi tiết"),
  });
  const saveManufacturerDetail = async (manufacturer) => {
    setLoadingButton(true);
    if (isAdd) {
      try {
        await ManufacturerService.addNewManufacturer(manufacturer);
        toast.success("Thêm nhà sản xuất thành công!");
        setLoadingButton(false);
        navigate("/manufacturer");
      } catch (error) {
        console.log(error);
        toast.error("Thêm nhà sản xuất thất bại!");
        setLoadingButton(false);
      }
    } else {
      try {
        await ManufacturerService.updateManufacturer(manufacturer);
        toast.success("Sửa nhà sản xuất thành công!");
        setLoadingButton(false);
        navigate(`/manufacturer/detail/${manufacturerId}`);
      } catch (error) {
        console.log(error);
        toast.error("Thêm nhà sản xuất thất bại!");
        setLoadingButton(false);
      }
    }
  };
  const handleSubmit = (values) => {
    const newManufacturer = {
      id: isAdd ? "" : manufacturerId,
      name: values.name,
      address: values.address,
      email: values.email,
      phone: values.phone,
    };
    console.log(newManufacturer);
    saveManufacturerDetail(newManufacturer);
  };
  const handleOnClickExit = () => {
    navigate(
      isAdd ? "/manufacturer" : `/manufacturer/detail/${manufacturerId}`
    );
  };
  const getManufacturerdetail = async () => {
    try {
      const actionResult = await ManufacturerService.getManufacturerById(
        manufacturerId
      );
      if (actionResult.data) {
        setManufacturer(actionResult.data.manufacturer);
      }
    } catch (error) {
      console.log("Failed to fetch category list: ", error);
    }
  };
  useEffect(() => {
    if (!isAdd) {
      if (isNaN(manufacturerId)) {
        navigate("/404");
      } else {
        getManufacturerdetail();
      }
    }
  }, []);

  return (
    <Container maxWidth="lg">
      <Box>
        {manufacturer && !isAdd && (
          <Formik
            initialValues={{ ...manufacturer }}
            validationSchema={FORM_VALIDATION}
            onSubmit={(values) => handleSubmit(values)}
          >
            {({ values, errors, setFieldValue }) => (
              <Form>
                <Box>
                  <Card className="CardInfo">
                    <CardHeader title="Thông tin nhà sản xuất" />

                    <CardContent>
                      <Grid container spacing={2} padding={2}>
                        <Grid xs={12} item>
                          <Typography className="wrapIcon">
                            Tên nhà sản xuất
                          </Typography>
                          <TextfieldWrapper
                            name="name"
                            fullWidth
                            id="name"
                            autoComplete="name"
                            autoFocus
                          />
                        </Grid>
                        <Grid xs={12} item>
                          <Typography className="wrapIcon">
                            Số điện thoại
                          </Typography>
                          <TextfieldWrapper
                            name="phone"
                            fullWidth
                            id="phone"
                            autoComplete="phone"
                          />
                        </Grid>
                        <Grid xs={12} item>
                          <Typography className="wrapIcon">Email</Typography>
                          <TextfieldWrapper
                            name="email"
                            fullWidth
                            id="email"
                            autoComplete="email"
                          />
                        </Grid>
                        <Grid xs={12} item>
                          <Typography className="wrapIcon">Địa chỉ</Typography>
                          <TextfieldWrapper
                            name="address"
                            fullWidth
                            id="address"
                            autoComplete="address"
                          />
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                  <Card>
                    <Stack
                      direction="row"
                      spacing={2}
                      justifyContent="flex-end"
                      padding="20px"
                    >
                      <LoadingButton
                        color="warning"
                        variant="contained"
                        loading={loadingButton}
                        type="submit"
                        loadingPosition="start"
                        startIcon={<CheckIcon />}
                      >
                        Lưu chỉnh sửa
                      </LoadingButton>
                      <Button
                        color="error"
                        onClick={() => handleOnClickExit()}
                        disabled={loadingButton}
                        variant="contained"
                        startIcon={<ClearIcon />}
                      >
                        Hủy chỉnh sửa
                      </Button>
                    </Stack>
                  </Card>
                </Box>
              </Form>
            )}
          </Formik>
        )}
        {!manufacturer && !!isAdd && (
          <Formik
            initialValues={{ ...initialManufacturerValue }}
            validationSchema={FORM_VALIDATION}
            onSubmit={(values) => handleSubmit(values)}
          >
            {({ values, errors, setFieldValue }) => (
              <Form>
                <Box>
                  <Card className="CardInfo">
                    <CardHeader title="Thông tin nhà sản xuất" />

                    <CardContent>
                      <Grid container spacing={2} padding={2}>
                        <Grid xs={12} item>
                          <Typography className="wrapIcon">
                            Tên nhà sản xuất
                          </Typography>
                          <TextfieldWrapper
                            name="name"
                            fullWidth
                            id="name"
                            autoComplete="name"
                            autoFocus
                          />
                        </Grid>
                        <Grid xs={12} item>
                          <Typography className="wrapIcon">
                            Số điện thoại
                          </Typography>
                          <TextfieldWrapper
                            name="phone"
                            fullWidth
                            id="phone"
                            autoComplete="phone"
                          />
                        </Grid>
                        <Grid xs={12} item>
                          <Typography className="wrapIcon">Email</Typography>
                          <TextfieldWrapper
                            name="email"
                            fullWidth
                            id="email"
                            autoComplete="email"
                          />
                        </Grid>
                        <Grid xs={12} item>
                          <Typography className="wrapIcon">Địa chỉ</Typography>
                          <TextfieldWrapper
                            name="address"
                            fullWidth
                            id="address"
                            autoComplete="address"
                          />
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                  <Card>
                    <Stack
                      direction="row"
                      spacing={2}
                      justifyContent="flex-end"
                      padding="20px"
                    >
                      <LoadingButton
                        color="warning"
                        variant="contained"
                        loading={loadingButton}
                        type="submit"
                        loadingPosition="start"
                        startIcon={<CheckIcon />}
                      >
                        Thêm nhà sản xuất
                      </LoadingButton>
                      <Button
                        color="error"
                        onClick={() => handleOnClickExit()}
                        disabled={loadingButton}
                        variant="contained"
                        startIcon={<ClearIcon />}
                      >
                        Hủy
                      </Button>
                    </Stack>
                  </Card>
                </Box>
              </Form>
            )}
          </Formik>
        )}
      </Box>
    </Container>
  );
};

export default AddEditManufacturer;
