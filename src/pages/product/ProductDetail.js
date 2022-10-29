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

const ProductDetail = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState({});
  const navigate = useNavigate();

  const handleOnClickEdit = () => {
    navigate(`/product/edit/${productId}`);
  };

  useEffect(() => {
    ProductService.getProductbyId(productId)
      .then((response) => {
        console.log(response.data);
        setProduct(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [productId]);

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
                <Typography>{product.manufacturerName}</Typography>
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
                <Typography color="#696969">Mô tả sản phẩm</Typography>
              </Grid>
              <Grid xs={2} item>
                <Typography>{product.description}</Typography>
              </Grid>
            </Grid>
          </Stack>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default ProductDetail;
