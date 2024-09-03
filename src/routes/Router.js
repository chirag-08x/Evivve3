import React, { lazy } from "react";
import { Navigate } from "react-router-dom";

import Loadable from "../layouts/full/shared/loadable/Loadable";

/* ***Layouts**** */
const FullLayout = Loadable(lazy(() => import("../layouts/full/FullLayout")));
const BlankLayout = Loadable(
  lazy(() => import("../layouts/blank/BlankLayout"))
);
const PresenModeLayout = Loadable(
  lazy(() => import("../layouts/blank/PresenModeLayout"))
);

/* ***Authentication pages****      */
const Error = Loadable(lazy(() => import("../views/authentication/Error")));
const Login = Loadable(
  lazy(() => import("../views/authentication/auth1/Login"))
);
const Signup = Loadable(
  lazy(() => import("../views/authentication/auth1/Register"))
);
const ForgotPassword = Loadable(
  lazy(() => import("../views/authentication/auth1/ForgotPassword"))
);
const ResetPassword = Loadable(
  lazy(() => import("../views/authentication/auth1/ResetPass"))
);

/* ****Pages***** */
const Programs = Loadable(
  lazy(() => import("../views/pages/programs/Programs"))
);
const ProgramScreen = Loadable(
  lazy(() => import("../views/pages/programs/components/ProgramScreen"))
);
const Present = Loadable(lazy(() => import("../views/pages/present/Present")));
const Dashboard = Loadable(
  lazy(() => import("../views/pages/dashboard/Dashboard"))
);
const Community = Loadable(
  lazy(() => import("../views/pages/community/Community"))
);
const CommunitySpace = Loadable(
  lazy(() => import("../views/pages/community/CommunitySpace"))
);
const Learn = Loadable(lazy(() => import("../views/pages/learn/Learn")));
const Settings = Loadable(
  lazy(() => import("../views/pages/settings/Settings"))
);
const Transactions = Loadable(
  lazy(() => import("../views/pages/transactions/Transactions"))
);
const Support = Loadable(lazy(() => import("../views/pages/support/Support")));

const Router = [
  {
    path: "/",
    element: <FullLayout />,
    children: [
      { path: "/", element: <Navigate to="/dashboard" /> },
      { path: "/programs", element: <Programs /> },
      { path: "/programs/:id", element: <ProgramScreen /> },
      { path: "/dashboard", element: <Dashboard /> },
      { path: "/learn", element: <Learn /> },
      { path: "/community", element: <Community /> },
      // { path: "/transactions", element: <Transactions /> },
      { path: "/support", element: <Support /> },
      { path: "/settings", element: <Settings /> },
      { path: "*", element: <Navigate to="/auth/404" /> },
    ],
  },
  {
    path: "/",
    element: <FullLayout fullscreen />,
    children: [
      { path: "*", element: <Navigate to="/auth/404" /> },
      { path: "/community-space", element: <CommunitySpace /> },
    ],
  },
  {
    path: "/",
    element: <PresenModeLayout />,
    children: [
      { path: "/programs/present/:id", element: <Present /> },
      { path: "*", element: <Navigate to="/auth/404" /> },
    ],
  },
  {
    path: "/",
    element: <BlankLayout />,
    children: [
      { path: "/auth/404", element: <Error /> },
      { path: "/auth/login", element: <Login /> },
      { path: "/auth/sign-up", element: <Signup /> },
      { path: "/auth/forgot-password", element: <ForgotPassword /> },
      { path: "/auth/reset-password", element: <ResetPassword /> },
      { path: "/programs/present", element: <Present /> },
      { path: "*", element: <Navigate to="/auth/404" /> },
    ],
  },
];

export default Router;
