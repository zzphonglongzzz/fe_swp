import * as Yup from "yup";
import { toast } from "react-toastify";
import { Form, Formik, useField } from "formik";
import { useState, useEffect } from "react";
import CategoryService from "../../service/CategoryService";
import { Box, Grid, Stack, Typography, TextField, Button } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import CheckIcon from '@mui/icons-material/Check';
import "./AddEditSubCategory.scss";
import * as React from "react";
import LoadingButton from '@mui/lab/LoadingButton';


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
const AddSubCateory = (props) => {
  const { closePopup, selectedCategory } = props;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const initialFormValue = {
    name: "",
    description: "",
  };
  const FORM_VALIDATION = Yup.object().shape({
    name: Yup.string()
      .max(255, "Tên danh mục không thể dài quá 255 kí tự")
      .required("Chưa nhập tên danh mục"),
    description: Yup.string().max(255, "Mô tả không thể dài quá 255 kí tự"),
  });
  const handleOnClickExit = () => {
    closePopup();
  };
  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    const newSubCategory = {
      name: values.name,
      description: values.description,
      categoryId:selectedCategory,
    };
    console.log(newSubCategory);
    try {
      const response= await CategoryService.saveSubCategory(newSubCategory)
      if (response.data) {
        toast.success('Thêm danh mục thành công!', { autoClose: 5000 });
        window.location.reload(true);
        window.close();
        setIsSubmitting(false);
      }
    } catch (error) {
      setIsSubmitting(false);
      console.log("Failed to save sub-Category: ", error);
      toast.error("Thêm danh mục thất bại!");
    }
  };
  useEffect(() => {
    
  }, []);
  return (
    <Formik
      initialValues={{
        ...initialFormValue,
      }}
      validationSchema={FORM_VALIDATION}
      onSubmit={(values) => handleSubmit(values)}
    >
      {({ values, setFieldValue }) => (
        <Form>
          <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="stretch"
          >
            <Grid xs={12} item>
              <Box>
                <Box className="infoContainer">
                  <Typography variant="span" className="wrapIcon">
                    Tên danh mục:
                  </Typography>
                  <TextfieldWrapper
                    name="name"
                    fullWidth
                    id="name"
                    autoComplete="name"
                    autoFocus
                  />
                </Box>
                <Box className="infoContainer">
                  <Typography className="wrapIcon">Mô tả:</Typography>
                  <TextfieldWrapper
                    name="description"
                    fullWidth
                    multiline
                    rows={4}
                    id="description"
                    autoFocus
                  />
                </Box>
              </Box>
            </Grid>
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
                  Lưu
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
  );
};

export default AddSubCateory;
