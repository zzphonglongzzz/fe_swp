import { Form, Formik, useField } from "formik";
import { useState } from "react";
import { toast } from "react-toastify";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import * as Yup from "yup";
import {
  Box,
  Button,
  Container,
  Grid,
  Stack,
  Typography,
  TextField,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import "./Warehouse.scss";
import WarehouseService from "../../service/WarehouseService";

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
const AddWarehouse = (props) => {
  const { closePopup } = props;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const initialFormValue = {
    name: "",
    address: "",
  };
  const FORM_VALIDATION = Yup.object().shape({
    name: Yup.string()
      .max(255, "Tên danh mục không thể dài quá 255 kí tự")
      .required("Chưa nhập tên nhà kho"),
    address: Yup.string().max(255, "Mô tả không thể dài quá 255 kí tự"),
  });
  const handleOnClickExit = () => {
    closePopup();
  };
  const saveWarehouse = async (warehouse) => {
    setIsSubmitting(true);
    try {
      const actionResult = await WarehouseService.createNewWarehouse(warehouse);
      if (actionResult.data) {
        toast.success("Thêm danh kho thành công!", { autoClose: 2000 });
        window.location.reload(true);
        window.close();
        setIsSubmitting(false);
      }
    } catch (error) {
      setIsSubmitting(false);
      console.log("Failed to save warehouse: ", error);
      toast.error("Thêm danh nhà kho!");
    }
  };
  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    const newWarehouse = {
      name: values.name,
      address: values.address,
    };
    saveWarehouse(newWarehouse);
  };
  return (
    <Container maxWidth="lg">
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="stretch"
      >
        <Formik
          initialValues={{
            ...initialFormValue,
          }}
          validationSchema={FORM_VALIDATION}
          onSubmit={(value) => handleSubmit(value)}
        >
          {({ values, errors, setFieldValue }) => (
            <Form>
              <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="stretch"
              >
                <Box>
                  <Box
                    sx={{ borderBottom: "1px solid #A7A7A7" }}
                    className="infoContainer"
                  >
                    <Typography className="wrapIcon">Tên nhà kho:</Typography>
                    <TextfieldWrapper
                      className="styleInput"
                      name="name"
                      fullWidth
                      id="name"
                      autoComplete="name"
                    />
                  </Box>
                  <Box className="infoContainer">
                    <Typography className="wrapIcon">Địa chỉ</Typography>
                    <TextfieldWrapper
                      className="styleInput"
                      name="address"
                      fullWidth
                      id="address"
                      autoComplete="address"
                    />
                  </Box>
                </Box>
              </Grid>
              <Stack
                direction="row"
                spacing={2}
                justifyContent="flex-end"
                padding="20px"
              >
                <LoadingButton
                  color="success"
                  type="submit"
                  loading={isSubmitting}
                  loadingposition="start"
                  variant="contained"
                  startIcon={<CheckIcon />}
                >
                  Thêm nhà kho
                </LoadingButton>
                <Button
                  color="error"
                  onClick={() => handleOnClickExit()}
                  variant="contained"
                  disabled={isSubmitting}
                  startIcon={<ClearIcon />}
                >
                  Hủy
                </Button>
              </Stack>
            </Form>
          )}
        </Formik>
      </Grid>
    </Container>
  );
};

export default AddWarehouse;
