import { Button, Stack, Typography } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';
const AccessDenied = () => {
    const navigate = useNavigate();
    return ( 
        <Stack
        height={100}
        justifyContent="center"
        alignItems="center"
        spacing={3}
      >
        <Typography variant="h4">
          <b>Bạn không có quyền truy cập vào trang này</b>
        </Typography>
        <img
          height={450}
          width={450}
          src={require('@/assets/images/403 Error.png')}
        />
        <Button
          variant="contained"
          onClick={() => navigate('/')}
        >
          Đi đến trang chủ
        </Button>
      </Stack>
     );
}
 
export default AccessDenied;