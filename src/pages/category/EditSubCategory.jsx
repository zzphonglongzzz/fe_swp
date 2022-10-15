import { Form, Formik, useField, useFormikContext } from "formik";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { toast } from "react-toastify";
import * as Yup from "yup";
import CategoryService from "../../service/CategoryService";
import { Box, Grid, Stack, Typography, TextField, Button } from "@mui/material";
import React from "react";

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
  const { closePopup, category } = props;
  const navigate = useNavigate();
  const [categoryList, setCategoryList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState();
  const isAdd = !category;
  const [loadingSelect, setLoadingSelect] = useState(true);
  const initialFormValue = {
    name: category.name,
    categoryId: category.id,
    description: category.description,
  };
  const FORM_VALIDATION = Yup.object().shape({
    name: Yup.string()
      .max(255, "Tên danh mục không thể dài quá 255 kí tự")
      .required("Chưa nhập tên danh mục"),
    description: Yup.string().max(255, "Mô tả không thể dài quá 255 kí tự"),
  });
  const getSelectedParent = () => {
    //console.log(category.id);
    setSelectedCategory(category.id);
  };
  //update sub-category
  // const updateCategoryDetail = (category) => {
  //   try {
  //     console.log(category);
  //     if (category.categoryId) {
  //       CategoryService.updateSubCategory(category)
  //         .then((response) => {
  //           toast.success("Sửa danh mục con thành công");
  //           navigate(`/category/detail/${category.id}`);
  //         })
  //         .catch((error) => {
  //           console.log(error);
  //         });
  //     }
  //   } catch (error) {
  //     console.log("Failed to save category: ", error);
  //     if (error.message) {
  //       toast.error(error.message);
  //     } else {
  //       toast.error("Sửa danh mục thất bại!");
  //     }
  //   }
  // };

  const handleSubmit = (values) => {
    const newCategory = {
      id: category.id,
      name: values.name,
      description: values.description,
      categoryId: values.categoryId,
    };
    //updateCategoryDetail(newCategory);
  };
  
  const getAllCategory = () => {
    try {
      CategoryService.getAllCategory()
        .then((response) => {
          setCategoryList(response.data); // edit
          setLoadingSelect(false);
        })
        .catch((error) => {
          console.log(error);
          setLoadingSelect(false);
        });
    } catch (error) {
      console.log("Failed to fetch category list: ", error);
    }
  };
  useEffect(() => {
    getSelectedParent();
    getAllCategory();
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
              {!!category && (
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
                  {!!category.id && (
                    <Box className="selectContainer">
                      <Typography variant="span">Danh mục cha:</Typography>
                      {!!categoryList && (
                        <Select
                          className="selectBox"
                          placeholder="Chọn danh mục cha"
                          noOptionsMessage={() => (
                            <>Không có tìm thấy danh mục nào</>
                          )}
                          isSearchable={true}
                          isLoading={loadingSelect}
                          loadingMessage={() => (
                            <>Đang tìm kiếm danh mục cha...</>
                          )}
                          name="category"
                          // value={FormatDataUtils.getSelectedOption(
                          //   categoryList,
                          //   selectedCategory
                          // )}
                          // options={FormatDataUtils.getOptionWithIdandName(
                          //   categoryList
                          // )}
                          menuPortalTarget={document.body}
                          styles={{
                            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                          }}
                          onChange={(e) => {
                            setFieldValue("categoryId", e?.value);
                            setSelectedCategory(e?.value);
                          }}
                        />
                      )}
                    </Box>
                  )}

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
              )}
            </Grid>
          </Grid>
          <Stack
            direction="row"
            spacing={2}
            justifyContent="flex-end"
            padding="20px"
          >
            <ButtonWrapper disabled={loadingSelect} variant="contained">
              Lưu
            </ButtonWrapper>
          </Stack>
        </Form>
      )}
    </Formik>
  );
};
export default EditSubCategory;
