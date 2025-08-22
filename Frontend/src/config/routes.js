import React from "react";
import { ROUTE_PATH } from "../constants/routePath";

// Lazy load các trang
const AuthPage = React.lazy(() => import("../pages/AuthPage"));
const OTPVerifiPage = React.lazy(() => import("../pages/OPTVerifiPage"));

// Cấu hình route
const AppRoute = [
  // Authen
  { path: ROUTE_PATH.LOGIN, page: AuthPage },
  { path: ROUTE_PATH.REGISTRATION, page: AuthPage },
  { path: ROUTE_PATH.OTPVERIFICATION, page: OTPVerifiPage },
];

export default AppRoute;
