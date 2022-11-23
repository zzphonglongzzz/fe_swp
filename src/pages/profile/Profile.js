import AuthService from "../../service/AuthService";
import { useEffect, useRef, useState } from "react";
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
import { LockReset, ManageAccounts, PhotoCamera } from "@mui/icons-material";
import { toast } from 'react-toastify';
import FormatDataUtils from "../../utils/FormatDataUtils";
import "./Profile.css"


const Profile = () => {
  const staffId = AuthService.getCurrentUser().id;
  const [openPopup, setOpenPopup] = useState(false);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState();
  const [image, setImage] = useState();
  const hiddenFileInput = useRef(null);
  const navigate = useNavigate();
  const [staff, setStaff] = useState();

  const handleUpdateImage = () => {
    console.log("cập nhật ảnh đại diện");
    hiddenFileInput.current.click();
  };
  const handleChangeImageStaff = async (e) => {
    console.log(e.target.files[0]);
    const file = e.target.files[0];
    if (file.type !== "image/png" && file.type !== "image/jpeg") {
      setTitle("Chú ý");
      setMessage("");
      setErrorMessage("Vui lòng chọn file ảnh có định dạng .png hoặc .jpg");
      setOpenPopup(true);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setTitle("Chú ý");
      setMessage("");
      setErrorMessage("Vui lòng chọn file có dung lượng nhỏ hơn 5MB");
      setOpenPopup(true);
      return;
    }

    setImage(URL.createObjectURL(file));
    const formData = new FormData();
    formData.append("file", file);
    try {
      const params = {
        staffId: staffId,
        formData: formData,
      };
      const dataResult = await dispatch(updateImageStaff(params));
      //const actionResult = unwrapResult(actionResult);
      console.log("dataResult", dataResult);
      if (dataResult) {
        toast.success(dataResult.message);
        fetchStaffDetail();
      }
    } catch (error) {
      console.log("Failed to set active staff: ", error);
    }
  };
  const handleResetPassword = () => {
    navigate("/reset-password");
  };
  const handleUpdateProfile = () => {
    navigate("/profile/edit");
  };
  const fetchStaffDetail = async () => {
    try {
      const dataResult = await dispatch(getStaffDetail(staffId));
      // const dataResult = unwrapResult(actionResult);
      console.log("dataResult", dataResult);
      if (dataResult) {
        setStaff(dataResult.data);
        if (dataResult.data.imageUrl) {
          fetchImage(process.env.REACT_APP_API_URL + "/" + dataResult.data.imageUrl);
        }
      }
    } catch (error) {
      console.log("Failed to fetch staff detail: ", error);
    }
  };
  const fetchImage = async (imageUrl) => {
    const res = await fetch(imageUrl);
    const imageBlob = await res.blob();
    const imageObjectURL = URL.createObjectURL(imageBlob);
    setImage(imageObjectURL);
  };
  useEffect(() => {
    fetchStaffDetail();
  }, []);

  return (
    <Box>
      {staff && (
        <Grid container spacing={2}>
          <Grid xs={2.5} item>
            <Grid container spacing={2}>
              <Grid xs={12} item>
                <Card>
                  <CardContent className="imgContainer">
                    <Stack spacing={2}>
                      <img
                        className="imgProfile"
                        accept="image/*"
                        src={
                          image
                            ? image
                            : require("/image/default-avatar.jpg")
                            
                        }
                      />
                      <Button
                        variant="outlined"
                        startIcon={<PhotoCamera />}
                        color="warning"
                        fullWidth
                        onClick={() => handleUpdateImage()}
                      >
                        Cập nhật ảnh đại diện
                      </Button>
                      <input
                        accept="image/png, image/gif, image/jpeg"
                        style={{ display: "none" }}
                        ref={hiddenFileInput}
                        onChange={(e) => handleChangeImageStaff(e)}
                        id="upload-file"
                        type="file"
                      />
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
              <Grid xs={12} item>
                <Card>
                  <Stack padding={2} spacing={2} alignItems="center">
                    <Box>{staff.roleName}</Box>
                    {/* <Box>{getStatusLabel(Boolean(staff.isActive))}</Box> */}
                  </Stack>
                </Card>
              </Grid>
            </Grid>
          </Grid>
          <Grid xs={9.5} item>
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
                      <Typography>Mã nhân viên</Typography>
                    </Grid>
                    <Grid xs={9} item>
                      <Typography>{staff.userName}</Typography>
                    </Grid>
                  </Grid>
                  <Grid container>
                    <Grid xs={3} item>
                      <Typography>Số điện thoại</Typography>
                    </Grid>
                    <Grid xs={9} item>
                      <Typography>{staff.phone}</Typography>
                    </Grid>
                  </Grid>
                  <Grid container>
                    <Grid xs={3} item>
                      <Typography>Email</Typography>
                    </Grid>
                    <Grid xs={9} item>
                      <Typography>{staff.email}</Typography>
                    </Grid>
                  </Grid>
                  <Grid container>
                    <Grid xs={3} item>
                      <Typography>Số CCCD/CMND</Typography>
                    </Grid>
                    <Grid xs={9} item>
                      <Typography>{staff.identityCard}</Typography>
                    </Grid>
                  </Grid>
                  <Grid container>
                    <Grid xs={3} item>
                      <Typography>Địa chỉ</Typography>
                    </Grid>
                    <Grid xs={9} item>
                      <Typography>
                        {staff.detailAddress}, {staff.wardName},{" "}
                        {staff.districtName}, {staff.provinceName}
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid container>
                    <Grid xs={3} item>
                      <Typography>Ngày sinh</Typography>
                    </Grid>
                    <Grid xs={9} item>
                      <Typography>
                        {FormatDataUtils.formatDate(staff.dateOfBirth)}
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid container>
                    <Grid xs={3} item>
                      <Typography>Giới tính</Typography>
                    </Grid>
                    <Grid xs={9} item>
                      <Typography>
                        {staff.gender === 1 ? "Nam" : "Nữ"}
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
          {/* <AlertPopup
            maxWidth="sm"
            title={errorMessage ? "Chú ý" : title}
            openPopup={openPopup}
            setOpenPopup={setOpenPopup}
            isConfirm={!errorMessage}
            //handleConfirm={handleConfirm}
          >
            <Box component={"span"} className="popupMessageContainer">
              {errorMessage ? errorMessage : message}
            </Box>
          </AlertPopup> */}
        </Grid>
      )}
    </Box>
  );
};

export default Profile;
