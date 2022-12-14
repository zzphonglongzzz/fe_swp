import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { LockReset, ManageAccounts } from "@mui/icons-material";
import FormatDataUtils from "../../utils/FormatDataUtils";
import "./Profile.css";
import StaffService from "../../service/StaffService";

const Profile = () => {
  // const staffId = AuthService.getCurrentUser().id;
  //const [openPopup, setOpenPopup] = useState(false);
  //const [title, setTitle] = useState("");
  //const [message, setMessage] = useState("");
  //const [errorMessage, setErrorMessage] = useState();
  //const [image, setImage] = useState();
  //const hiddenFileInput = useRef(null);
  const navigate = useNavigate();
  const [staff, setStaff] = useState();

  // const handleUpdateImage = () => {
  //   console.log("cập nhật ảnh đại diện");
  //   hiddenFileInput.current.click();
  // };
  // const handleChangeImageStaff = async (e) => {
  //   console.log(e.target.files[0]);
  //   const file = e.target.files[0];
  //   if (file.type !== "image/png" && file.type !== "image/jpeg") {
  //     setTitle("Chú ý");
  //     setMessage("");
  //     setErrorMessage("Vui lòng chọn file ảnh có định dạng .png hoặc .jpg");
  //     setOpenPopup(true);
  //     return;
  //   }

  //   if (file.size > 5 * 1024 * 1024) {
  //     setTitle("Chú ý");
  //     setMessage("");
  //     setErrorMessage("Vui lòng chọn file có dung lượng nhỏ hơn 5MB");
  //     setOpenPopup(true);
  //     return;
  //   }

  //   setImage(URL.createObjectURL(file));
  //   const formData = new FormData();
  //   formData.append("file", file);
  //   try {
  //     const params = {
  //       staffId: staffId,
  //       formData: formData,
  //     };
  //     const dataResult = await dispatch(updateImageStaff(params));
  //     //const actionResult = unwrapResult(actionResult);
  //     console.log("dataResult", dataResult);
  //     if (dataResult) {
  //       toast.success(dataResult.message);
  //       fetchStaffDetail();
  //     }
  //   } catch (error) {
  //     console.log("Failed to set active staff: ", error);
  //   }
  // };
  const handleResetPassword = () => {
    navigate("/reset-password");
  };
  const handleUpdateProfile = () => {
    navigate("/profile/edit");
  };
  const fetchStaffDetail = async () => {
    try {
      const dataResult = await StaffService.getProfile();
      console.log("dataResult", dataResult);
      if (dataResult) {
        setStaff(dataResult.data);
      }
    } catch (error) {
      console.log("Failed to fetch staff detail: ", error);
    }
  };
  // const fetchImage = async (imageUrl) => {
  //   const res = await fetch(imageUrl);
  //   const imageBlob = await res.blob();
  //   const imageObjectURL = URL.createObjectURL(imageBlob);
  //   setImage(imageObjectURL);
  // };
  useEffect(() => {
    fetchStaffDetail();
  }, []);

  return (
    <Box>
      {staff && (
        <Grid container spacing={2}>
          <Grid xs={12}>
            <Card>
              <CardHeader title="Thông tin cá nhân" />
              <CardContent>
                <Stack padding={2} spacing={2}>
                  <Grid container>
                    <Grid xs={3} item>
                      <Typography>Họ và tên</Typography>
                    </Grid>
                    <Grid xs={9} item>
                      <Typography>{staff.fullName}</Typography>
                    </Grid>
                  </Grid>
                  <Grid container>
                    <Grid xs={3} item>
                      <Typography>Tên đăng nhập</Typography>
                    </Grid>
                    <Grid xs={9} item>
                      <Typography>{staff.username}</Typography>
                    </Grid>
                  </Grid>
                  <Grid container>
                    <Grid xs={3} item>
                      <Typography>Số điện thoại</Typography>
                    </Grid>
                    <Grid xs={9} item>
                      <Typography>{staff?.phone}</Typography>
                    </Grid>
                  </Grid>
                  <Grid container>
                    <Grid xs={3} item>
                      <Typography>Email</Typography>
                    </Grid>
                    <Grid xs={9} item>
                      <Typography>{staff?.email}</Typography>
                    </Grid>
                  </Grid>
                  <Grid container>
                    <Grid xs={3} item>
                      <Typography>Ngày sinh</Typography>
                    </Grid>
                    <Grid xs={9} item>
                      <Typography>
                        {FormatDataUtils.formatDate(staff.dob)}
                      </Typography>
                    </Grid>
                  </Grid>
                  <Stack direction="row" spacing={2} justifyContent="flex-end">
                    <Button
                      variant="contained"
                      startIcon={<LockReset />}
                      onClick={() => handleResetPassword()}
                    >
                      Đổi mật khẩu
                    </Button>

                    <Button
                      variant="contained"
                      startIcon={<ManageAccounts />}
                      color="warning"
                      onClick={() => handleUpdateProfile()}
                    >
                      Chỉnh sửa hồ sơ
                    </Button>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default Profile;
