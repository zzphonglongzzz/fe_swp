import { Form, Formik, useField, useFormikContext } from "formik";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { toast } from "react-toastify";
import * as Yup from "yup";
import CategoryService from "../../service/CategoryService";
import { Box, Grid, Stack, Typography, TextField, Button } from "@mui/material";
import React from "react";
import FormatDataUtils from "../../utils/FormatDataUtils";

const ButtonWrapper = ({ children, ...otherProps }) => {
  const { submitForm } = useFormikContext();

  const handleSubmit = () => {
    submitForm();
  };

  const configButton = {
    ...otherProps,
    onClick: handleSubmit,
  };
  return <Button {...configButton}> {children}</Button>;
};
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

const EditSubCategory = (props) => {
  const { closePopup, Subcategory, categoryId } = props;
  const [categoryList, setCategoryList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState();
  const [loadingSelect, setLoadingSelect] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initialFormValue = {
    name: Subcategory.name,
    SubcategoryId: Subcategory.id,
    description: Subcategory.description,
  };
  const FORM_VALIDATION = Yup.object().shape({
    name: Yup.string()
      .max(255, "Tên danh mục không thể dài quá 255 kí tự")
      .required("Chưa nhập tên danh mục"),
    description: Yup.string().max(255, "Mô tả không thể dài quá 255 kí tự"),
  });
  const getSelectedParent = () => {
    setSelectedCategory(categoryId);
  };
  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    const newCategory = {
      id: values.SubcategoryId,
      name: values.name,
      description: values.description,
      categoryId: selectedCategory,
    };
    try {
      const response = await CategoryService.updateSubCategory(newCategory);
      if (response.data) {
        toast.success("Sửa danh mục thành công!", { autoClose: 5000 });
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

  const fetchCategoryList = async () => {
    try {
      const actionResult = await CategoryService.getAll();
      if (actionResult.data) {
        setCategoryList(actionResult.data.category);
      }
    } catch (error) {
      console.log("Failed to fetch category list: ", error);
    }
  };
  useEffect(() => {
    getSelectedParent();
    fetchCategoryList();
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
                <Box className="selectContainer">
                  <Typography variant="span">Danh mục cha:</Typography>
                  <Select
                    className="selectBox"
                    placeholder="Chọn danh mục cha"
                    noOptionsMessage={() => <>Không có tìm thấy danh mục nào</>}
                    isSearchable={true}
                    isLoading={loadingSelect}
                    loadingMessage={() => <>Đang tìm kiếm danh mục cha...</>}
                    name="categoryId"
                    value={FormatDataUtils.getSelectedOption(
                      categoryList,
                      selectedCategory
                    )}
                    options={FormatDataUtils.getOptionWithIdandName(
                      categoryList
                    )}
                    menuPortalTarget={document.body}
                    styles={{
                      menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                    }}
                    onChange={(e) => {
                      setFieldValue("categoryId", e.value);
                      setSelectedCategory(e.value)
                      console.log(e.value)
                    }}
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
            <ButtonWrapper variant="contained">
              Lưu
            </ButtonWrapper>
          </Stack>
        </Form>
      )}
    </Formik>
  );
};
export default EditSubCategory;
