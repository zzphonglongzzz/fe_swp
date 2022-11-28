import { useState, useEffect } from "react";
import * as Yup from "yup";
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
import CategoryService from "../../service/CategoryService";

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
const EditCategory = (props) => {
  const { selectedCategory, closePopup } = props;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [category, setCategory] = useState();
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
    const newCategory = {
      id: selectedCategory,
      name: values.name,
      description: values.description,
    };
    try {
      const actionResult = await CategoryService.updateCategory(newCategory);
      if (actionResult.data) {
        toast.success("Sửa danh mục thành công!");
        setTimeout(() => {
          window.location.reload(true);
          window.close();
        }, 2000);
        setIsSubmitting(false);
      }
    } catch (error) {
      setIsSubmitting(false);
      console.log("Failed to save category: ", error);
      toast.error("Sửa danh mục thất bại!");
    }
    closePopup();
  };

  const initialFormValue = {
    name: category?.name || "",
    description: category?.description || "",
  };
  useEffect(() => {
    const getCategoryDetail = async () => {
      try {
        const params = {
          categoryId: selectedCategory,
        };
        const actionResult = await CategoryService.getCategoryDetail(params);
        if (actionResult.data) {
          setCategory(actionResult.data.category);
        }
      } catch (error) {
        console.log("Failed to fetch category list: ", error);
      }
    };
    getCategoryDetail();
  }, [selectedCategory]);
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
                    <Typography className="wrapIcon">Tên danh mục:</Typography>
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
                      name="description"
                      fullWidth
                      id="description"
                      autoComplete="description"
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

export default EditCategory;
