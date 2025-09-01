import React from "react";
import { ROUTE_PATH } from "../constants/routePath";

import MainLayout from "../layouts/MainLayout";

// Lazy load các trang
const AuthPage = React.lazy(() => import("../pages/AuthPage"));
const OTPVerifiPage = React.lazy(() => import("../pages/OPTVerifiPage"));
const HomePage = React.lazy(() => import("../pages/HomePage"));
const PostUploadPage = React.lazy(() => import("../pages/PostUploadPage"));

// Cấu hình route với layout
const AppRoute = [
  // Authen
  { 
    path: ROUTE_PATH.LOGIN, 
    page: AuthPage,
  },
  { 
    path: ROUTE_PATH.REGISTRATION, 
    page: AuthPage,
  },
  { 
    path: ROUTE_PATH.OTPVERIFICATION, 
    page: OTPVerifiPage,
  },

  // Home 
  { 
    path: ROUTE_PATH.HOME, 
    page: HomePage,
    layout: MainLayout 
  },

  // Upload Post
  {
    path: ROUTE_PATH.UPLOADPOST,
    page: PostUploadPage,
    layout: MainLayout
  }
];

export default AppRoute;
