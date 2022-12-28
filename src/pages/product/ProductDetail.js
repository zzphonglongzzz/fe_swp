import { useNavigate, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import {
  Grid,
  Card,
  Stack,
  Typography,
  Button,
  CardContent,
} from "@mui/material";
import { Edit } from "@mui/icons-material";
import "./product.scss";
import ProductService from "../../service/ProductService";
import FormatDataUtils from "../../utils/FormatDataUtils";

const ProductDetail = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState({});
  const navigate = useNavigate();
  const [imageUrl, setImageUrl] = useState();

  const handleOnClickEdit = () => {
    navigate(`/product/edit/${productId}`);
  };

  const fetchProductDetail = async () => {
    try {
      const params = {
        productId: productId,
      };
      const actionResult = await ProductService.getProductById(params);
      if (actionResult.data) {
        setProduct(actionResult.data.product);
        setImageUrl("/image/" + actionResult.data.product.image);
      } else {
        navigate("/404");
      }
    } catch (error) {
      console.log("Failed to fetch category list: ", error);
    }
  };
  useEffect(() => {
    fetchProductDetail();
  }, []);

  return (
    <Grid container spacing={2}>
      <Grid xs={12} item>
        <Card>
          <Stack direction="row" justifyContent="space-between" p={2}>
            <Typography variant="h6">
              <strong>{product.name}</strong>
            </Typography>

            <Button
              variant="contained"
              startIcon={<Edit />}
              color="warning"
              onClick={() => handleOnClickEdit()}
            >
              Chỉnh sửa
            </Button>
          </Stack>
        </Card>
      </Grid>
      <Grid xs={12} item>
        <Card>
          {/* <CardHeader title="Thông tin sản phẩm" /> */}
          <CardContent>
            <Typography variant="h6">Thông tin sản phẩm</Typography>
            <CardContent className="infoStyle">
              <Grid container spacing={2}>
                <Grid xs={8} item>
                  <Grid container spacing={2}>
                    <Grid xs={12} item>
                      <Grid container>
                        <Grid xs={1} item></Grid>
                        <Grid xs={3} item>
                          <Typography className="labelInfo">
                            Mã sản phẩm
                          </Typography>
                        </Grid>
                        <Grid xs={5} item>
                          <Typography className="contentInfo">
                            {product.productCode}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid xs={12} item>
                      <Grid container>
                        <Grid xs={1} item></Grid>
                        <Grid xs={3} item>
                          <Typography className="labelInfo">
                            Nhà sản xuất
                          </Typography>
                        </Grid>
                        <Grid xs={5} item>
                          <Typography className="contentInfo">
                            {product.manufactorName}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid xs={12} item>
                      <Grid container>
                        <Grid xs={1} item></Grid>
                        <Grid xs={3} item>
                          <Typography className="labelInfo">
                            Danh mục
                          </Typography>
                        </Grid>
                        <Grid xs={5} item>
                          <Typography className="contentInfo">
                            {product.categoryName}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid xs={12} item>
                      <Grid container>
                        <Grid xs={1} item></Grid>
                        <Grid xs={3} item>
                          <Typography className="labelInfo">
                            Danh mục phụ
                          </Typography>
                        </Grid>
                        <Grid xs={5} item>
                          <Typography className="contentInfo">
                            {product.subcategoryName}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid xs={12} item>
                      <Grid container>
                        <Grid xs={1} item></Grid>
                        <Grid xs={3} item>
                          <Typography className="labelInfo">
                            Đơn giá nhập
                          </Typography>
                        </Grid>
                        <Grid xs={5} item>
                          <Typography className="contentInfo">
                            {FormatDataUtils.formatCurrency(
                              product?.lastAveragePrice || 0
                            )}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid xs={12} item>
                      <Grid container>
                        <Grid xs={1} item></Grid>
                        <Grid xs={3} item>
                          <Typography className="labelInfo">
                            Đơn giá xuất
                          </Typography>
                        </Grid>
                        <Grid xs={5} item>
                          <Typography className="contentInfo">
                            {FormatDataUtils.formatCurrency(
                              product?.unitprice || 0
                            )}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid xs={12} item>
                      <Grid container>
                        <Grid xs={1} item></Grid>
                        <Grid xs={3} item>
                          <Typography className="labelInfo">
                            Mô tả sản phẩm
                          </Typography>
                        </Grid>
                        <Grid xs={5} item>
                          <Typography className="descriptionField">
                            {product.description}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid xs={4} item>
                  <Stack alignItems="center">
                    <img
                      // component="img"
                      // height="250"
                      // sx={{ width: 250 }}
                      className="imageStyle"
                      alt="Ảnh sản phẩm"
                      // src={image}
                      loading="lazy"
                      src={imageUrl !== "/image/null" ? imageUrl : "/image/default_avatar.jpg"}
                    />
                  </Stack>
                </Grid>
              </Grid>
            </CardContent>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default ProductDetail;
