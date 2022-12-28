import "./DefaultLayout.scss";
import Sidebar from "../../component/DefaultLayout/sidebar/Sidebar";
import Navbar from "../../component/DefaultLayout/navbar/Navbar";
import { Box, CssBaseline, Stack } from "@mui/material";
import { useTheme } from '@mui/material/styles';

function DefaultLayout({ children }) {
  const theme = useTheme();
  return (
    <Box>
      <CssBaseline />
      <Stack
        direction="row"
        justifyContent="space-between"
        sx={{ backgroundColor: theme.palette.sidebar.main }}
      >
        <Sidebar />
        <Stack flex={6}>
          <Navbar />
          <Box sx={{ backgroundColor: "#fbfbfb", minHeight: "94vh" }} p={2}>
            {children}
          </Box>
        </Stack>
      </Stack>
    </Box>
  );
}

export default DefaultLayout;
