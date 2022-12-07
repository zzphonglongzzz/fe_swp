import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ExportOrderService from "../../service/ExportOrderService";
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  Link,
  Stack,
  Typography,
} from "@mui/material";
import CustomTablePagination from "../../component/common/Pagination/index";
import FormatDataUtils from "../../utils/FormatDataUtils";
import AlertPopup from "../../component/common/AlertPopup";
import ReturnProductTable from "./ReturnProductTable";

const ReturnOrderDetail = () => {
  const { returnOrderId } = useParams();
  const [listConsignments, setListConsignments] = useState([]);
  const [returnOrder, setReturnOrder] = useState();
  const [openPopup, setOpenPopup] = useState(false);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const pages = [5, 10, 20];
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(pages[page]);
  const [totalRecord, setTotalRecord] = useState(0);

  const calculateTotalAmount = () => {
    let totalAmount = 0;
    if (listConsignments) {
      const productList = returnOrder;
      for (let index = 0; index < productList.length; index++) {
        totalAmount =
          totalAmount +
          +productList[index]?.quantity * +productList[index]?.unit_price;
      }
    }
    return totalAmount;
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const fetchReturnOrderDetail = async () => {
    try {
      const params = {
        orderId: returnOrderId,
      };
      const dataResult = await ExportOrderService.getReturnOrderDetail(params);
      //const dataResult = unwrapResult(actionResult);
      if (dataResult.data) {
        setReturnOrder(dataResult.data.listExportProduct);
      }
      console.log("Return Order Detail", dataResult);
    } catch (error) {
      console.log("Failed to fetch exportOrder detail: ", error);
    }
  };
  useEffect(() => {
    fetchReturnOrderDetail();
  }, []);

  return (
    <>
      {returnOrder && (
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Card>
              <Stack direction="row" justifyContent="space-between" p={2}>
                <Box className="billReferenceContainer">
                  <Typography variant="span">
                    <strong>Phiếu trả hàng từ phiếu xuất hàng số:</strong> {"XUAT" + returnOrder[0].order_code}
                  </Typography>{" "}
                  {/* <span>
                            {FormatDataUtils.getStatusLabel(importOrder.statusName)}
                          </span> */}
                </Box>
              </Stack>
            </Card>
          </Grid>
          <Grid xs={9} item>
            <Grid container spacing={2}>
              <Grid xs={12} item>
                <Card className="cardTable">
                  {!!returnOrder && returnOrder.length > 0 ? (
                    <Box>
                      <ReturnProductTable listConsignments={returnOrder} />
                      {totalRecord > 10 && (
                        <CustomTablePagination
                          page={page}
                          pages={pages}
                          rowsPerPage={rowsPerPage}
                          totalRecord={totalRecord}
                          handleChangePage={handleChangePage}
                          handleChangeRowsPerPage={handleChangeRowsPerPage}
                        />
                      )}
                    </Box>
                  ) : (
                    <Box> Phiếu nhập chưa có lô hàng nào </Box>
                  )}
                </Card>
              </Grid>
            </Grid>
          </Grid>
          <Grid xs={3} item>
            <Grid container spacing={2}>
              <Grid xs={12} item>
                <Card>
                  <CardContent className="confirmInfo">
                    <Typography variant="h6">Thông tin xác nhận</Typography>
                    <Typography>
                      Người tạo đơn: <i>{"(" + returnOrder[0].creator + ")"}</i>
                    </Typography>
                    {/* <Typography>Ngày tạo đơn:</Typography> */}
                    {/* <Typography>
                              {FormatDataUtils.formatDateTime(importOrder.createDate)}
                            </Typography> */}

                    {returnOrder[0].confirm_by && (
                      <Box>
                        <br />
                        <Typography>
                          Người xác nhận: <i>{returnOrder[0].confirm_by}</i>
                        </Typography>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
            <Grid xs={12} item>
              <Card>
                <CardContent>
                  <Typography variant="h6">Tổng giá trị đơn hàng</Typography>
                  <Typography align="left">
                    {FormatDataUtils.formatCurrency(calculateTotalAmount())}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          <AlertPopup
            maxWidth="sm"
            title={title}
            openPopup={openPopup}
            setOpenPopup={setOpenPopup}
            isConfirm={true}
          >
            <Box component={"span"} className="popupMessageContainer">
              {message}
            </Box>
          </AlertPopup>
        </Grid>
      )}
      ;
    </>
  );
};

export default ReturnOrderDetail;
