import {
  Box,
  Button,
  CardContent,
  Dialog,
  Divider,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { IconArrowLeft } from "@tabler/icons";
import moment from "moment";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { PrimaryBtn } from "src/components/shared/BtnStyles";
import { DialogHeading } from "src/components/shared/DialogComponents";
import { useGetTransactions } from "src/services/programs";
import CreditTransactionRecord from "./CreditTransactionRecord";

const TransactionsDialog = ({ open, onClose }) => {
  const [value, setValue] = useState(0);
  const [pagination, setPagination] = useState({offset: 0, limit: 0, total: 0});

  const [ordersData, setOrdersData] = useState({result: []});
  const ordersMutation = useGetTransactions('orders', {
    onSuccess: ({data}) => {
        setOrdersData(data);
        const temp = {...pagination};
        if (value == 0) {
            temp.offset = data?.offset || 0;
            temp.limit = data?.limit || 0;
            temp.total = data?.total || 0;
        }
        setPagination(temp);
    },
    onError: () => {
        toast.error("Orders transaction fetch failed");
    }
  });

  const [creditTxnData, setCreditTxnData] = useState({result: []});
  const creditsMutation = useGetTransactions('credits', {
    onSuccess: ({data}) => {
        setCreditTxnData(data);
        const temp = {...pagination};
        if (value == 1) {
            temp.offset = data?.offset || 0;
            temp.limit = data?.limit || 0;
            temp.total = data?.total || 0;
        }
        setPagination(temp);
    },
    onError: () => {
        toast.error("Credit transaction fetch failed");
    }
  });

  useEffect(() => {
      const temp = {...pagination};
      if (value == 0) {
          temp.offset = ordersData?.offset || 0;
          temp.limit = ordersData?.limit || 0;
          temp.total = ordersData?.total || 0;
      } else {
          temp.offset = creditTxnData?.offset || 0;
          temp.limit = creditTxnData?.limit || 0;
          temp.total = creditTxnData?.total || 0;
      }
      setPagination(temp);
  }, [value]);

  useEffect(() => {
      if (open) {
          ordersMutation.mutate({offset: 0});
          creditsMutation.mutate({offset: 0});
      }
  }, [open]);

  function paginate (value, offset) {
      if (value == 0) {
          ordersMutation.mutate({offset});
      } else if (value == 1) {
          creditsMutation.mutate({offset});
      }
  }

  function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && <Box>{children}</Box>}
      </div>
    );
  }

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  }

  return (
    <Dialog
      PaperProps={{
        style: {
          borderRadius: "8px",
          background: "#FFF",
          boxShadow:
            "0px 24px 36px -8px rgba(0, 0, 0, 0.25), 0px 0px 1px 0px rgba(0, 0, 0, 0.31)",
          width: "900px",
          height: "100%",
          padding: "1rem",
        },
      }}
      maxWidth="900px"
      open={open}
      onClose={onClose}
    >
      <button
        style={{
          width: "50px",
          background: "transparent",
          border: "none",
          cursor: "pointer",
        }}
        onClick={onClose}
      >
        <IconArrowLeft />
      </button>
      <DialogHeading style={{ textAlign: "left", padding: "5px 15px" }}>
        Your Recent Transactions
      </DialogHeading>

      <Box>
        <Tabs
          value={value}
          onChange={(event, newValue) => setValue(newValue)}
          scrollButtons="auto"
          aria-label="basic tabs example"
          variant="scrollable"
        >
          <Tab
            iconPosition="start"
            // icon={<IconUserCircle size="22" />}
            label="Invoices"
            {...a11yProps(0)}
          />
          <Tab
            iconPosition="start"
            // icon={<IconArticle size="22" />}
            label="Credit Transactions"
            {...a11yProps(1)}
          />
        </Tabs>
      </Box>
      <Divider />

      <CardContent sx={{ height: "100%", pb: 1 }}>
        <TabPanel value={value} index={0}>
          {ordersData?.result?.length > 0 ? (
            <Box
              border={2}
              height="100%"
              borderColor="rgba(0, 0, 0, 0.23)"
              borderRadius={1}
            >
              {ordersData?.result?.map(({ initiated_at, credits }, idx) => {
                return (
                  <Stack
                    key={idx}
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    borderBottom={1}
                    borderColor="rgba(0, 0, 0, 0.23)"
                    p={1}
                  >
                    <Typography fontWeight={600}>
                      You brought {credits?.credits} credits on{" "}
                      {moment(initiated_at).format("DD MMMM, YYYY")}
                    </Typography>

                    <PrimaryBtn
                      style={{ fontSize: "13px", padding: "4px 9px" }}
                      width="auto"
                    >
                      View Invoice
                    </PrimaryBtn>
                  </Stack>
                );
              })}
            </Box>
          ) : (
            <Typography textAlign="center" variant="h6">
              You haven't done any Transactions yet.
            </Typography>
          )}
        </TabPanel>

        <TabPanel value={value} index={1}>
          {creditTxnData?.result?.length > 0 ? (
            <Box
              border={2}
              height="100%"
              borderColor="rgba(0, 0, 0, 0.23)"
              borderRadius={1}
            >
              {creditTxnData?.result?.map(o => {
                return (
                  <Stack
                    key={o.id}
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    borderBottom={1}
                    borderColor="rgba(0, 0, 0, 0.23)"
                    p={1}
                  >
                    <Typography fontWeight={600} style={{width: '100%'}}>
                      <div style={{display: 'flex', justifyContent: 'space-between', width: '100%'}}>
                        <CreditTransactionRecord record={o} />
                        <div style={{fontWeight: '400'}}>{moment(o.recordedAt).format("DD MMMM, YYYY")}</div>
                      </div>
                    </Typography>
                  </Stack>
                );
              })}
            </Box>
          ) : (
            <Typography textAlign="center" variant="h6">
              You haven't done any Transactions yet.
            </Typography>
          )}
        </TabPanel>
      </CardContent>

      <div style={{display: 'flex', flexDirection: 'row-reverse', justifyContent: 'space-between'}}>
        {pagination.total > pagination.offset + pagination.limit && <div onClick={() => paginate(pagination.offset + pagination.limit)}>Next</div>}
        {pagination.offset > 0 && <div onClick={() => paginate(pagination.offset - pagination.limit)}>Previous</div>}
      </div>
    </Dialog>
  );
};

export default TransactionsDialog;
