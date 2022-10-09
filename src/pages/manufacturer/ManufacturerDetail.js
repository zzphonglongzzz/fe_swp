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
import "./ManufacturerDetail.scss";
import ManufacturerService from "../../service/ManufacturerService";

const ManufacturerDetail = () => {
  const { manufacturerId } = useParams();
  const [manufacturer, setManufacturer] = useState([]);
  const navigate = useNavigate();

  //   const handleOnClickEdit = () => {
  //     navigate(`/manufacturer/edit/${manufacturerId}`);
  //   };
  useEffect(() => {
    console.log(manufacturerId);
    ManufacturerService.getManufacturerById(manufacturerId)
      .then((response) => {
        setManufacturer(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [manufacturerId]);
  return (
    <Grid>
      <Card className="CardHeader">
        <Stack>
          <Typography variant="h5" style={{ fontWeight: "bold" }}>
            {manufacturer.name}
          </Typography>
        </Stack>
        <Button
          // onClick={() => handleOnClickEdit()}
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
                <Typography color="#696969">Số điện thoại</Typography>
              </Grid>
              <Grid xs={10} item>
                <Typography>{manufacturer.phone}</Typography>
              </Grid>
            </Grid>
            <Grid container>
              <Grid xs={2} item>
                <Typography color="#696969">Email</Typography>
              </Grid>
              <Grid xs={10} item>
                <Typography>{manufacturer.email}</Typography>
              </Grid>
            </Grid>
            <Grid container>
              <Grid xs={2} item>
                <Typography color="#696969"> Địa chỉ</Typography>
              </Grid>
              <Grid xs={10} item>
                <Typography>{manufacturer.address}</Typography>
              </Grid>
            </Grid>
          </Stack>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default ManufacturerDetail;
