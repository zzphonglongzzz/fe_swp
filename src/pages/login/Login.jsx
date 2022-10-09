import "./login.scss";
import {
  TextField,
  Button,
  Box,
  Typography,
  Grid,
  Stack,
  Link,
} from "@mui/material";
import { Field, Form, Formik } from "formik";
import { object, string } from "yup";
import LockIcon from "@mui/icons-material/Lock";

const Login = () => {
  const initalValues = {
    username: "",
    password: "",
  };
  return (
    <div className="MaterialForm">
      <Formik
        initialValues={initalValues}
        validationSchema={object({
          username: string().required("Vui lòng nhập tên đăng nhập"),
          password: string().required("Vui lòng nhập mật khẩu"),
        })}
        onSubmit={(values, formikHelpers) => {
          console.log(values);
          formikHelpers.resetForm();
        }}
      >
        {({ errors, isValid, touched, dirty }) => (
          <Form>
            <Grid container justifyContent="center">
              <LockIcon />
            </Grid>
            <Typography textAlign="center" variant="h5">
              Đăng nhập
            </Typography>
            <Box height={20} />
            <Field
              name="username"
              type="name"
              as={TextField}
              variant="outlined"
              color="primary"
              label="Tên Đăng Nhập"
              fullWidth
              error={Boolean(errors.username) && Boolean(touched.username)}
              helperText={Boolean(touched.username) && errors.username}
            />
            <Box height={20} />
            <Field
              name="password"
              type="password"
              as={TextField}
              variant="outlined"
              color="primary"
              label="Mật khẩu"
              fullWidth
              error={Boolean(errors.password) && Boolean(touched.password)}
              helperText={Boolean(touched.password) && errors.password}
            />
            <Box height={14} />

            <Stack
              direction="row"
              justifyContent="flex-end"
              alignItems="center"
            >
              <Link href="/forgotPassword" variant="body2">
                Quên mật khẩu?
              </Link>
            </Stack>
            <Box height={14} />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              disabled={!isValid || !dirty}
            >
              Đăng nhập
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
};
export default Login;
