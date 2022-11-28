import { useNavigate, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import {
  Grid,
  Card,
  Stack,
  Typography,
  Button,
  CardHeader,
  CardContent,
} from "@mui/material";
import CreateIcon from "@mui/icons-material/Create";
import "./product.scss";
import ProductService from "../../service/ProductService";
import FormatDataUtils from "../../utils/FormatDataUtils";

const ProductDetail = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState({});
  const navigate = useNavigate();

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
      }
    } catch (error) {
      console.log("Failed to fetch category list: ", error);
    }
  };
  useEffect(() => {
    fetchProductDetail();
  }, []);

  return (
    <Grid>
      <Card className="CardHeader">
        <Stack>
          <Typography variant="h5" style={{ fontWeight: "bold" }}>
            {product.name}
          </Typography>
        </Stack>
        <Button
          onClick={() => handleOnClickEdit()}
          color="warning"
          variant="contained"
          startIcon={<CreateIcon />}
        >
          Chỉnh sửa
        </Button>
      </Card>
      <Card className="infoContainer">
        <CardHeader title="Thông tin chi tiết" />
        <CardContent>
          <Stack paddingX={3} spacing={2}>
            <Grid container>
              <Grid xs={2} item>
                <Typography color="#696969">Mã sản phẩm</Typography>
              </Grid>
              <Grid xs={2} item>
                <Typography>{product.productCode}</Typography>
              </Grid>
            </Grid>
            <Grid container>
              <Grid xs={2} item>
                <Typography color="#696969">Nhà sản xuất</Typography>
              </Grid>
              <Grid xs={2} item>
                <Typography>{product.manufactorName}</Typography>
              </Grid>
            </Grid>
            <Grid container>
              <Grid xs={2} item>
                <Typography color="#696969">Danh mục</Typography>
              </Grid>
              <Grid xs={2} item>
                <Typography>{product.categoryName}</Typography>
              </Grid>
            </Grid>
            <Grid container>
              <Grid xs={2} item>
                <Typography color="#696969">Đơn giá</Typography>
              </Grid>
              <Grid xs={2} item>
                <Typography>
                  {FormatDataUtils.getRoundFloorNumber(product.unitprice)}
                </Typography>
              </Grid>
            </Grid>
            <Grid container>
              <Grid xs={2} item>
                <Typography color="#696969">Mô tả sản phẩm</Typography>
              </Grid>
              <Grid xs={2} item>
                <Typography>{product.description}</Typography>
              </Grid>
            </Grid>
            <Grid xs={2} item>
              <Stack alignItems="center">
                <img
                  // component="img"
                  // height="250"
                  // sx={{ width: 250 }}
                  className="imageStyle"
                  alt="Ảnh sản phẩm"
                  // src={image}
                  loading="lazy"
                  src={`/image/${product.image}`}
                />
              </Stack>
            </Grid>
          </Stack>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default ProductDetail;
