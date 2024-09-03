import React, { useEffect, useState } from "react";
import {
  CardContent,
  Grid,
  Typography,
  MenuItem,
  Box,
  Avatar,
  Button,
  Stack,
  Chip,
} from "@mui/material";

// components
import BlankCard from "../../shared/BlankCard";
import CustomTextField from "../../forms/theme-elements/CustomTextField";
import CustomFormLabel from "../../forms/theme-elements/CustomFormLabel";
import CustomSelect from "../../forms/theme-elements/CustomSelect";
import { useSelector } from "react-redux";
import { TimezoneSelect } from "src/components/shared/AuthStyles";
import { tzStrings } from "src/utils/timezones/timezonez";
import { v4 as uuid } from "uuid";
import Autocomplete from "@mui/material/Autocomplete";
import { useGetRoles } from "src/services/programs";
import {
  useGetE3UserInfo,
  useUpdateE3UserInfo,
  useUpdateE3UserPass,
} from "src/services/user";

// images
import user1 from "src/assets/images/profile/user-1.jpg";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useUpdateProfilePic } from "src/services/authentication";

// locations
const locations = [
  {
    value: "us",
    label: "United States",
  },
  {
    value: "uk",
    label: "United Kingdom",
  },
  {
    value: "india",
    label: "India",
  },
  {
    value: "russia",
    label: "Russia",
  },
];

// currency
const currencies = [
  {
    value: "us",
    label: "US Dollar ($)",
  },
  {
    value: "uk",
    label: "United Kingdom (Pound)",
  },
  {
    value: "india",
    label: "India (INR)",
  },
  {
    value: "russia",
    label: "Russia (Ruble)",
  },
];

const AccountTab = () => {
  useGetRoles();
  const { data, refetch } = useGetE3UserInfo();
  const updateUserInfo = useUpdateE3UserInfo();
  const updateUserPass = useUpdateE3UserPass();
  const roles = useSelector((state) => state?.programs?.roles);
  const dispatch = useDispatch();
  const [userInfo, setUserInfo] = useState({});
  const userId = useSelector((state) => state?.user?.profile?.id);
  const [password, setPassword] = useState({
    old: "",
    new: "",
    confirm: "",
  });
  const updateProfilePic = useUpdateProfilePic();

  useEffect(() => {
    if (data) {
      setUserInfo(data?.data?.user);
    }
  }, [data]);

  const handlePasswordChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setPassword({ ...password, [name]: value });
  };

  const handleChange = (e) => {
    const name = e.target.name;
    let value = e.target.value;

    setUserInfo({ ...userInfo, [name]: value });
  };

  const handleSubmit = () => {
    if (password.old || password.new || password.confirm) {
      if (!password.old)
        return toast.warning("Please enter your current password");
      if (!password.new) return toast.warning("Please enter your new password");
      if (!password.confirm)
        return toast.warning("Please confirm your password");
      if (password.new !== password.confirm)
        return toast.warning("Password does not match.");
      updateUserPass.mutate({
        userID: userId,
        oldPassword: password.old,
        newPassword: password.new,
      });
      setPassword({
        old: "",
        new: "",
        confirm: "",
      });
    }
    updateUserInfo.mutate({
      userId,
      ...userInfo,
    });
  };

  const resetChanges = () => {
    refetch();
  };

  const handlePicUpload = async (e) => {
    const file = await e.target.files[0];

    if (file.size > 2 * 1024 * 1024) {
      return toast.warning("Image size cannot exceed 2mb.");
    }

    const pic = new FormData();
    pic.append("avatar", file);
    updateProfilePic.mutate(pic);
  };

  return (
    <Grid container spacing={3}>
      {/* Change Profile */}
      <Grid item xs={12} lg={6}>
        <BlankCard>
          <CardContent>
            <Typography variant="h5" mb={1}>
              Edit Profile
            </Typography>
            <Typography color="textSecondary" mb={3}>
              Update Profile Picture
            </Typography>
            <Box textAlign="center" display="flex" justifyContent="center">
              <Box>
                <Avatar
                  src={userInfo?.avatarUrl}
                  alt={user1}
                  sx={{ width: 120, height: 120, margin: "0 auto" }}
                />
                <Stack
                  direction="row"
                  justifyContent="center"
                  spacing={2}
                  my={3}
                >
                  <Button variant="contained" color="primary" component="label">
                    Upload
                    <input
                      hidden
                      accept="image/jpeg,image/jpg,image/png"
                      // multiple
                      type="file"
                      onChange={handlePicUpload}
                    />
                  </Button>
                  <Button variant="outlined" color="error">
                    Reset
                  </Button>
                </Stack>
                <Typography variant="subtitle1" color="textSecondary" mb={4}>
                  Allowed Formats: JPG, PNG. Max Size: 2MB
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </BlankCard>
      </Grid>
      {/*  Change Password */}
      <Grid item xs={12} lg={6}>
        <BlankCard sx={{ position: "relative" }}>
          <CardContent>
            <Typography variant="h5" mb={1}>
              Change Password
            </Typography>
            <Typography color="textSecondary" mb={3}>
              Please Confirm to Change Your Password
            </Typography>
            <form autoComplete="off">
              <CustomFormLabel
                sx={{
                  mt: 0,
                }}
                htmlFor="text-cpwd"
              >
                Current Password
              </CustomFormLabel>
              <CustomTextField
                id="text-cpwd"
                value={password.old}
                onChange={handlePasswordChange}
                name="old"
                variant="outlined"
                fullWidth
                type="password"
                disabled={userInfo?.authType === "GOOGLE"}
              />
              {/* 2 */}
              <CustomFormLabel htmlFor="text-npwd">
                New Password
              </CustomFormLabel>
              <CustomTextField
                id="text-npwd"
                value={password.new}
                onChange={handlePasswordChange}
                name="new"
                variant="outlined"
                fullWidth
                type="password"
                disabled={userInfo?.authType === "GOOGLE"}
              />
              {/* 3 */}
              <CustomFormLabel htmlFor="text-conpwd">
                Confirm New Password
              </CustomFormLabel>
              <CustomTextField
                id="text-conpwd"
                value={password.confirm}
                onChange={handlePasswordChange}
                name="confirm"
                variant="outlined"
                fullWidth
                type="password"
                disabled={userInfo?.authType === "GOOGLE"}
              />
            </form>
          </CardContent>

          {userInfo?.authType === "GOOGLE" && (
            <Box
              position="absolute"
              width="100%"
              height="100%"
              top={0}
              sx={{
                background: "rgba(0, 0, 0, 0.2)",
                display: "grid",
                placeItems: "center",
                color: "#002359",
                textAlign: "center",
              }}
            >
              <Chip
                sx={{
                  bgcolor: (theme) => theme.palette.secondary.light,
                  color: (theme) => theme.palette.secondary.main,
                  borderRadius: "8px",
                  fontSize: "14px",
                }}
                size="large"
                label={`Password reset functionality is not available for users signed in with Google.`}
              />
            </Box>
          )}
        </BlankCard>
      </Grid>
      {/* Edit Details */}
      <Grid item xs={12}>
        <BlankCard>
          <CardContent>
            <Typography variant="h5" mb={1}>
              Personal Information
            </Typography>
            <Typography color="textSecondary" mb={3}>
              Edit and Save Your Personal Information Here
            </Typography>
            <form>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <CustomFormLabel
                    sx={{
                      mt: 0,
                    }}
                    htmlFor="text-name"
                  >
                    Full Name
                  </CustomFormLabel>
                  <CustomTextField
                    id="text-name"
                    name="name"
                    value={userInfo?.name}
                    onChange={handleChange}
                    variant="outlined"
                    fullWidth
                    placeholder="Name"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  {/* 2 */}
                  <CustomFormLabel
                    sx={{
                      mt: 0,
                    }}
                    htmlFor="text-store-name"
                  >
                    Role
                  </CustomFormLabel>
                  {/* <Autocomplete
                    id="country-select-demo"
                    name="role"
                    fullWidth
                    options={roles}
                    autoHighlight
                    onChange={handleChange}
                    getOptionLabel={(option) => option?.displayName || ""}
                    value={userInfo?.role || ""}
                    sx={{
                      ".MuiAutocomplete-inputRoot": {
                        padding: "4px 7px",
                      },
                    }}
                    renderOption={(props, option) => (
                      <Box
                        component="li"
                        sx={{
                          fontSize: 15,
                          "& > span": { mr: "10px", fontSize: 16 },
                        }}
                        {...props}
                      >
                        <span style={{ fontSize: "14px" }}>
                          {option?.displayName}
                        </span>
                      </Box>
                    )}
                    renderInput={(params) => (
                      <CustomTextField
                        {...params}
                        placeholder="Choose a Role"
                        aria-label="Choose a Role"
                        autoComplete="off"
                        inputprops={{
                          ...params.inputprops,
                          // autoComplete: "new-password", // disable autocomplete and autofill
                        }}
                      />
                    )}
                  /> */}

                  <TimezoneSelect
                    name="role"
                    value={userInfo?.role}
                    style={{
                      border: "1px solid #DFE5EF",
                      borderRadius: "6px",
                      fontSize: "14px",
                      fontFamily: "inherit",
                      color: "inherit",
                    }}
                    onChange={handleChange}
                  >
                    <option value={""}>Choose a Role</option>
                    {roles?.map(({ id, displayName, roleName }) => (
                      <option key={id} value={roleName}>
                        {displayName}
                      </option>
                    ))}
                  </TimezoneSelect>

                  {/* <CustomTextField
                    id="text-store-name"
                    value="Facilitator"
                    variant="outlined"
                    fullWidth
                  /> */}
                </Grid>
                {/* <Grid item xs={12} sm={6}>
                  <CustomFormLabel
                    sx={{
                      mt: 0,
                    }}
                    htmlFor="text-location"
                  >
                    Location
                  </CustomFormLabel>
                  <CustomSelect
                    fullWidth
                    id="text-location"
                    variant="outlined"
                    value={location}
                    onChange={handleChange1}
                  >
                    {locations.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </CustomSelect>
                </Grid> */}
                {/* <Grid item xs={12} sm={6}>
                  <CustomFormLabel
                    sx={{
                      mt: 0,
                    }}
                    htmlFor="text-currency"
                  >
                    Currency
                  </CustomFormLabel>
                  <CustomSelect
                    fullWidth
                    id="text-currency"
                    variant="outlined"
                    value={currency}
                    onChange={handleChange2}
                  >
                    {currencies.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </CustomSelect>
                </Grid> */}
                <Grid item xs={12} sm={6}>
                  {/* 5 */}
                  <CustomFormLabel
                    sx={{
                      mt: 0,
                    }}
                    htmlFor="text-email"
                  >
                    Email
                  </CustomFormLabel>
                  <CustomTextField
                    id="text-email"
                    value={userInfo?.email}
                    name="email"
                    variant="outlined"
                    fullWidth
                    placeholder="Email Address"
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  {/* 6 */}
                  <CustomFormLabel
                    sx={{
                      mt: 0,
                    }}
                    htmlFor="text-phone"
                  >
                    Phone
                  </CustomFormLabel>
                  <CustomTextField
                    id="text-phone"
                    name="phone"
                    value={userInfo?.phone}
                    variant="outlined"
                    fullWidth
                    placeholder="Phone"
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  {/* 7 */}
                  <CustomFormLabel
                    sx={{
                      mt: 0,
                    }}
                    htmlFor="text-address"
                  >
                    Address
                  </CustomFormLabel>
                  <CustomTextField
                    id="text-address"
                    value={userInfo?.address}
                    variant="outlined"
                    name="address"
                    fullWidth
                    placeholder="Address"
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <CustomFormLabel
                    sx={{
                      mt: 0,
                    }}
                    htmlFor="text-timezone"
                  >
                    Timezone
                  </CustomFormLabel>
                  <TimezoneSelect
                    name="timezone"
                    value={userInfo?.timezone}
                    style={{
                      border: "1px solid #DFE5EF",
                      borderRadius: "6px",
                      fontSize: "14px",
                      fontFamily: "inherit",
                      color: "inherit",
                    }}
                    onChange={handleChange}
                  >
                    <option value="">Select Time Zone</option>
                    {tzStrings.map(({ label, value }) => (
                      <option key={uuid()} value={value}>
                        {label}
                      </option>
                    ))}
                  </TimezoneSelect>
                </Grid>

                <Grid></Grid>
              </Grid>
            </form>
          </CardContent>
        </BlankCard>
        <Stack
          direction="row"
          spacing={2}
          sx={{ justifyContent: "end" }}
          mt={3}
        >
          <Button
            size="large"
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={updateUserInfo.isLoading || updateUserPass.isLoading}
          >
            Save
          </Button>
          <Button
            size="large"
            variant="text"
            color="error"
            onClick={resetChanges}
          >
            Cancel
          </Button>
        </Stack>
      </Grid>
    </Grid>
  );
};

export default AccountTab;
