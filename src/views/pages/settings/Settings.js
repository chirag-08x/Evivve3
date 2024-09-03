import * as React from "react";
import PageContainer from "src/components/container/PageContainer";
import Breadcrumb from "src/layouts/full/shared/breadcrumb/Breadcrumb";
import {
  Grid,
  Tabs,
  Tab,
  Box,
  CardContent,
  Divider,
  ThemeProvider,
  Typography,
} from "@mui/material";

// components
import AccountTab from "../../../components/pages/account-setting/AccountTab";
import { IconArticle, IconBell, IconLock, IconUserCircle } from "@tabler/icons";
import BlankCard from "../../../components/shared/BlankCard";
import NotificationTab from "../../../components/pages/account-setting/NotificationTab";
import BillsTab from "../../../components/pages/account-setting/BillsTab";
import SecurityTab from "../../../components/pages/account-setting/SecurityTab";
import { BuildTheme } from "src/theme/Theme";

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Account Setting",
  },
];

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

const Settings = () => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const theme = BuildTheme({
    theme: "BLUE_THEME",
    direction: "ltr",
    light: false,
    activeMode: "light",
  });

  return (
    <ThemeProvider theme={theme}>
      <PageContainer
        title="Account Settings"
        description="this is Account Setting page"
      >
        {/* breadcrumb */}
        {/* <Breadcrumb title="Account Setting" items={BCrumb} /> */}
        <Typography variant="h5" pt={3} pb={5}>
          Account Settings
        </Typography>
        {/* end breadcrumb */}

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <BlankCard>
              <Box sx={{ maxWidth: { xs: 320, sm: 480 } }}>
                <Tabs
                  value={value}
                  onChange={handleChange}
                  scrollButtons="auto"
                  aria-label="basic tabs example"
                  variant="scrollable"
                >
                  <Tab
                    iconPosition="start"
                    icon={<IconUserCircle size="22" />}
                    label="Account"
                    {...a11yProps(0)}
                  />

                  {/* <Tab
                    iconPosition="start"
                    icon={<IconBell size="22" />}
                    label="Notifications"
                    {...a11yProps(1)}
                  /> */}
                  <Tab
                    iconPosition="start"
                    icon={<IconArticle size="22" />}
                    label="Billing"
                    {...a11yProps(1)}
                  />
                  {/* <Tab
                    iconPosition="start"
                    icon={<IconLock size="22" />}
                    label="Security"
                    {...a11yProps(2)}
                  /> */}
                </Tabs>
              </Box>
              <Divider />
              <CardContent>
                <TabPanel value={value} index={0}>
                  <AccountTab />
                </TabPanel>
                {/* <TabPanel value={value} index={1}>
                  <NotificationTab />
                </TabPanel> */}
                <TabPanel value={value} index={1}>
                  <BillsTab />
                </TabPanel>
                {/* <TabPanel value={value} index={2}>
                  <SecurityTab />
                </TabPanel> */}
              </CardContent>
            </BlankCard>
          </Grid>
        </Grid>
      </PageContainer>
    </ThemeProvider>
  );
};

export default Settings;
