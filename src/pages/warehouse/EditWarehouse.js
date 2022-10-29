import { useState, useEffect } from "react";
import * as Yup from "yup";
import WarehouseService from "../../service/WarehouseService";
import { toast } from "react-toastify";
import {
  Box,
  Button,
  Container,
  Grid,
  Stack,
  Typography,
  TextField,
} from "@mui/material";
import { Form, Formik, useField } from "formik";
import LoadingButton from "@mui/lab/LoadingButton";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";

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
const EditWarehouse = (props) => {
  const { selectedWarehouse, closePopup } = props;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [warehouse, setWarehouse] = useState();

  const FORM_VALIDATION = Yup.object().shape({
    name: Yup.string()
      .max(255, "Tên danh mục không thể dài quá 255 kí tự")
      .required("Chưa nhập tên danh mục"),
      address: Yup.string().max(255, "Mô tả không thể dài quá 255 kí tự"),
  });
  const saveWarehouse = async (warehouse) => {
    setIsSubmitting(true);
    try {
      const actionResult = await WarehouseService.updateWarehouse(warehouse)
      if (actionResult.data) {
        toast.success('Sửa nhà kho thành công!', { autoClose: 2000 });
        window.location.reload(true);
        window.close();
        setIsSubmitting(false);
      }
    } catch (error) {
      setIsSubmitting(false);
      console.log('Failed to save warehouse: ', error);
      toast.error('Sửa nhà kho thất bại!');
    }
  };
  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    const newWarehouse = {
      id: selectedWarehouse,
      name: values.name,  
      address: values.address,
    };
    //console.log(newWarehouse)
   saveWarehouse(newWarehouse);
  };

  const handleOnClickExit = () => {
    closePopup();
  };

  const initialFormValue = {
    name: warehouse?.name || "",
    address: warehouse?.address || "",
  };
  useEffect(() => {
    const getDetailWarehouseById = async () => {
      try {
        const actionResult = await WarehouseService.getWarehousebyId(selectedWarehouse);
        if (actionResult.data) {
          setWarehouse(actionResult.data.warehouse);
        }
      } catch (error) {
        console.log("Failed to fetch category list: ", error);
      }
    };
    getDetailWarehouseById();
  }, [selectedWarehouse]);

  return (
    <Container maxWidth="lg">
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="stretch"
      >
        <Formik
          enableReinitialize={true}
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
                    <Typography className="wrapIcon">Mô tả chi tiết</Typography>
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
                  loadingPosition="start"
                  variant="contained"
                  startIcon={<CheckIcon />}
                >
                  Lưu chỉnh sửa
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

export default EditWarehouse;
